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


class PrototypeFile(BaseModel):
    path: str = Field(..., min_length=1)
    content: str = ""


class WriteFilesRequest(BaseModel):
    files: list[PrototypeFile] = Field(default_factory=list)


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


def _relative_project_path(slug: str, path: Path) -> str:
    return f"prototypes/{_safe_slug(slug)}/{path.relative_to(_project_dir(slug).resolve()).as_posix()}"


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
