"""Safe file operations for generated prototype projects."""

from __future__ import annotations

import re
import socket
import subprocess
import time
from pathlib import Path
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parents[3]
PROTOTYPES_DIR = PROJECT_ROOT / "prototypes"

router = APIRouter(prefix="/prototype-projects", tags=["prototype-projects"])
RUNNING_SERVERS: dict[str, dict[str, Any]] = {}
IMPORT_SOURCE_RE = re.compile(
    r"""(?:import\s+(?:[^'"]+\s+from\s+)?|export\s+[^'"]+\s+from\s+|import\()\s*['"]([^'"]+)['"]"""
)
ASSET_SOURCE_RE = re.compile(
    r"""(?:src|href)=["'](\.{1,2}/[^"']+\.(?:svg|png|jpe?g|gif|webp))["']|url\(["']?(\.{1,2}/[^"')]+\.(?:svg|png|jpe?g|gif|webp))["']?\)"""
)


class PrototypeFile(BaseModel):
    path: str = Field(..., min_length=1)
    content: str = ""


class WriteFilesRequest(BaseModel):
    files: list[PrototypeFile] = Field(default_factory=list)


class CommitFilesRequest(WriteFilesRequest):
    run_id: str = Field(..., min_length=1, max_length=80)


class StartServerRequest(BaseModel):
    port: Optional[int] = Field(default=None, ge=1024, le=65535)
    auto_install: bool = True
    restart: bool = False


def _safe_slug(slug: str) -> str:
    normalized = slug.strip().lower()
    if not re.fullmatch(r"[\w\u4e00-\u9fff-]+", normalized):
        raise HTTPException(status_code=400, detail="Invalid prototype project slug")
    return normalized


def _project_dir(slug: str) -> Path:
    return PROTOTYPES_DIR / _safe_slug(slug)


def _safe_file_path(slug: str, raw_path: str) -> Path:
    project_dir = _project_dir(slug).resolve()
    path_text = raw_path.strip().replace("\\", "/")
    prefix = f"prototypes/{_safe_slug(slug)}/"
    if path_text.startswith(prefix):
        path_text = path_text[len(prefix):]
    path_text = path_text.lstrip("/")

    if not path_text or path_text.endswith("/"):
        raise HTTPException(status_code=400, detail="Invalid file path")

    target = (project_dir / path_text).resolve()
    if target != project_dir and project_dir not in target.parents:
        raise HTTPException(status_code=400, detail="File path escapes prototype project directory")

    return target


def _safe_run_id(run_id: str) -> str:
    normalized = run_id.strip()
    if not re.fullmatch(r"[\w.-]+", normalized):
        raise HTTPException(status_code=400, detail="Invalid prototype generation run id")
    return normalized


def _relative_project_path(slug: str, path: Path) -> str:
    return f"prototypes/{_safe_slug(slug)}/{path.relative_to(_project_dir(slug).resolve()).as_posix()}"


def _tail(text: str, limit: int = 3000) -> str:
    value = text or ""
    return value[-limit:] if len(value) > limit else value


def _project_relative(path: Path, project_dir: Path) -> str:
    return path.relative_to(project_dir).as_posix()


def _is_process_running(process: subprocess.Popen[str] | None) -> bool:
    return bool(process) and process.poll() is None


def _is_port_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.2)
        return sock.connect_ex(("127.0.0.1", port)) != 0


def _find_free_port(start: int = 5180) -> int:
    for port in range(start, start + 80):
        if _is_port_free(port):
            return port
    raise HTTPException(status_code=503, detail="No free local port for prototype dev server")


def _project_summary(path: Path) -> dict[str, Any]:
    slug = path.name
    files = [item for item in path.rglob("*") if item.is_file()]
    server = RUNNING_SERVERS.get(slug)
    running = _is_process_running(server.get("process") if server else None)
    return {
        "slug": slug,
        "name": slug,
        "output_dir": str(path),
        "has_package": (path / "package.json").exists(),
        "has_index": (path / "index.html").exists(),
        "file_count": len(files),
        "running": running,
        "url": server.get("url") if running and server else "",
    }


def _resolve_relative_source(project_dir: Path, owner: Path, source: str) -> bool:
    if not source.startswith("."):
        return True

    base = (owner.parent / source).resolve()
    project_root = project_dir.resolve()
    if base != project_root and project_root not in base.parents:
        return False

    if base.is_file():
        return True

    candidates: list[Path] = []
    if base.suffix:
        candidates.append(base)
    else:
        candidates.extend(base.with_suffix(ext) for ext in [".js", ".vue", ".json", ".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp"])
        candidates.extend(base / f"index{ext}" for ext in [".js", ".vue", ".json"])

    return any(candidate.exists() and candidate.is_file() for candidate in candidates)


def _validate_project_static(project_dir: Path) -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    required_files = [
        "package.json",
        "index.html",
        "src/main.js",
        "src/App.vue",
        "src/prototypeContract.js",
    ]

    for rel in required_files:
        if not (project_dir / rel).is_file():
            issues.append({"file": rel, "message": "缺少原型运行必需文件"})

    index_path = project_dir / "index.html"
    if index_path.is_file():
        index_content = index_path.read_text(encoding="utf-8", errors="replace")
        if not re.search(r"""charset=["']?UTF-8""", index_content, flags=re.I):
            issues.append({"file": "index.html", "message": "缺少 UTF-8 charset，可能导致浏览器标题乱码"})

    source_files = [
        path
        for path in (project_dir / "src").rglob("*")
        if path.is_file() and path.suffix in {".vue", ".js", ".css"}
    ] if (project_dir / "src").exists() else []

    for source_file in source_files:
        rel = _project_relative(source_file, project_dir)
        content = source_file.read_text(encoding="utf-8", errors="replace")
        if source_file.suffix == ".vue" and "withDefaults(defineProps({" in content:
            issues.append({"file": rel, "message": "withDefaults 只能配合 type-based defineProps 使用，当前写法会导致 Vue 编译失败"})

        for match in IMPORT_SOURCE_RE.finditer(content):
            raw_source = match.group(1)
            if not _resolve_relative_source(project_dir, source_file, raw_source):
                issues.append({"file": rel, "message": f"相对导入不存在或越界：{raw_source}"})

        for match in ASSET_SOURCE_RE.finditer(content):
            raw_source = match.group(1) or match.group(2)
            if raw_source and not _resolve_relative_source(project_dir, source_file, raw_source):
                issues.append({"file": rel, "message": f"静态资源不存在或越界：{raw_source}"})

    return issues


@router.get("")
def list_projects() -> dict[str, Any]:
    if not PROTOTYPES_DIR.exists():
        return {"output_dir": str(PROTOTYPES_DIR), "projects": []}

    projects = [
        _project_summary(path)
        for path in PROTOTYPES_DIR.iterdir()
        if path.is_dir()
    ]
    projects.sort(key=lambda item: item["name"])

    return {
        "output_dir": str(PROTOTYPES_DIR),
        "projects": projects,
    }


@router.get("/{slug}/status")
def read_project_status(slug: str) -> dict[str, Any]:
    project_dir = _project_dir(slug)
    if not project_dir.exists():
        return {
            "slug": _safe_slug(slug),
            "output_dir": str(project_dir),
            "exists": False,
            "files": [],
        }

    files = [
        _relative_project_path(slug, path.resolve())
        for path in project_dir.rglob("*")
        if path.is_file()
    ]
    files.sort()

    return {
        "slug": _safe_slug(slug),
        "output_dir": str(project_dir),
        "exists": True,
        "files": files,
    }


@router.post("/{slug}/validate")
def validate_project(slug: str) -> dict[str, Any]:
    safe_slug = _safe_slug(slug)
    project_dir = _project_dir(safe_slug)
    if not project_dir.exists():
        raise HTTPException(status_code=404, detail="Prototype project does not exist")
    if not (project_dir / "package.json").exists():
        raise HTTPException(status_code=400, detail="Prototype project package.json is missing")

    static_issues = _validate_project_static(project_dir)
    build_result: dict[str, Any] = {
        "ok": False,
        "returncode": None,
        "stdout_tail": "",
        "stderr_tail": "",
    }

    try:
        build = subprocess.run(
            ["npm", "run", "build"],
            cwd=project_dir,
            capture_output=True,
            text=True,
            timeout=180,
        )
        build_result = {
            "ok": build.returncode == 0,
            "returncode": build.returncode,
            "stdout_tail": _tail(build.stdout),
            "stderr_tail": _tail(build.stderr),
        }
    except subprocess.TimeoutExpired as exc:
        build_result = {
            "ok": False,
            "returncode": None,
            "stdout_tail": _tail(exc.stdout or ""),
            "stderr_tail": _tail(exc.stderr or "npm run build timed out"),
        }
    except OSError as exc:
        build_result = {
            "ok": False,
            "returncode": None,
            "stdout_tail": "",
            "stderr_tail": f"Failed to run npm build: {exc}",
        }

    return {
        "slug": safe_slug,
        "output_dir": str(project_dir),
        "ok": not static_issues and build_result["ok"],
        "static_issues": static_issues,
        "build": build_result,
    }


@router.post("/{slug}/files")
def write_project_files(slug: str, request: WriteFilesRequest) -> dict[str, Any]:
    if not request.files:
        raise HTTPException(status_code=400, detail="No files to write")

    project_dir = _project_dir(slug)
    project_dir.mkdir(parents=True, exist_ok=True)

    written: list[str] = []
    for file in request.files:
        target = _safe_file_path(slug, file.path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(file.content, encoding="utf-8")
        written.append(_relative_project_path(slug, target))

    return {
        "slug": _safe_slug(slug),
        "output_dir": str(project_dir),
        "written_count": len(written),
        "files": written,
    }


@router.post("/{slug}/files/commit")
def commit_project_files(slug: str, request: CommitFilesRequest) -> dict[str, Any]:
    if not request.files:
        raise HTTPException(status_code=400, detail="No files to commit")

    safe_slug = _safe_slug(slug)
    safe_run_id = _safe_run_id(request.run_id)
    project_dir = _project_dir(safe_slug)
    project_dir.mkdir(parents=True, exist_ok=True)

    targets: list[tuple[PrototypeFile, Path]] = [
        (file, _safe_file_path(safe_slug, file.path))
        for file in request.files
    ]

    staging_dir = project_dir / ".prototype_commits" / safe_run_id
    staged: list[tuple[Path, Path]] = []
    for file, target in targets:
        relative_target = target.relative_to(project_dir.resolve())
        staged_path = staging_dir / relative_target
        staged_path.parent.mkdir(parents=True, exist_ok=True)
        staged_path.write_text(file.content, encoding="utf-8")
        staged.append((staged_path, target))

    written: list[str] = []
    for staged_path, target in staged:
        target.parent.mkdir(parents=True, exist_ok=True)
        staged_path.replace(target)
        written.append(_relative_project_path(safe_slug, target))

    written.sort()
    return {
        "slug": safe_slug,
        "run_id": safe_run_id,
        "output_dir": str(project_dir),
        "written_count": len(written),
        "files": written,
    }


@router.post("/{slug}/dev-server")
def start_dev_server(slug: str, request: Optional[StartServerRequest] = None) -> dict[str, Any]:
    safe_slug = _safe_slug(slug)
    project_dir = _project_dir(safe_slug)
    if not project_dir.exists():
        raise HTTPException(status_code=404, detail="Prototype project does not exist")
    if not (project_dir / "package.json").exists():
        raise HTTPException(status_code=400, detail="Prototype project package.json is missing")

    existing = RUNNING_SERVERS.get(safe_slug)
    if existing and _is_process_running(existing.get("process")):
        if not request or not request.restart:
            return {
                "slug": safe_slug,
                "running": True,
                "url": existing["url"],
                "port": existing["port"],
                "reused": True,
            }
        existing["process"].terminate()
        try:
            existing["process"].wait(timeout=5)
        except subprocess.TimeoutExpired:
            existing["process"].kill()

    port = request.port if request and request.port else _find_free_port()
    if not _is_port_free(port):
        port = _find_free_port(port + 1)

    if request is None or request.auto_install:
        if not (project_dir / "node_modules").exists():
            install = subprocess.run(
                ["npm", "install"],
                cwd=project_dir,
                capture_output=True,
                text=True,
                timeout=180,
            )
            if install.returncode != 0:
                message = (install.stderr or install.stdout or "npm install failed").strip()
                raise HTTPException(status_code=500, detail=f"npm install failed: {message[-800:]}")

    command = ["npm", "run", "dev", "--", "--host", "127.0.0.1", "--port", str(port)]
    try:
        process = subprocess.Popen(
            command,
            cwd=project_dir,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except OSError as exc:
        raise HTTPException(status_code=500, detail=f"Failed to start prototype dev server: {exc}") from exc

    time.sleep(0.8)
    if process.poll() is not None:
        raise HTTPException(
            status_code=500,
            detail=f"Prototype dev server exited early. Run manually: cd {project_dir} && npm install && npm run dev",
        )

    url = f"http://127.0.0.1:{port}/"
    RUNNING_SERVERS[safe_slug] = {
        "process": process,
        "port": port,
        "url": url,
    }

    return {
        "slug": safe_slug,
        "running": True,
        "url": url,
        "port": port,
        "reused": False,
    }
