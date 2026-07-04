# fde-training-lab Project Structure

## Purpose

`fde-training-lab` is a training and prototype-factory workspace. It contains two related but separate lines of work:

- Python service capabilities for requirement analysis, fault reports, Excel summaries, and LLM calls.
- A Vue-based prototype factory that turns method-chain outputs into runnable Vue/Vite prototype systems.

## Backend Service Layer

`src/python_basics/` is the reusable Python service layer.

It contains business logic and utility code that can be called from multiple entrypoints:

- `requirement_service.py`: customer requirement parsing and report generation.
- `fault_report_service.py`: fault case report generation.
- `excel_summary_service.py`: Excel summary logic.
- `llm_service.py`: DeepSeek/OpenAI-compatible LLM calls and error mapping.
- `llm_config.py`: LLM configuration loading.
- `file_utils.py`: local file read/write helpers.
- `config_utils.py`: YAML/config helpers.
- `logging_utils.py`: CLI logging setup.
- `legacy/`: older training scripts kept as historical references.

Code in this layer should not depend on FastAPI, Vue, frontend state, or generated prototype projects.

## CLI Entry

`src/python_basics/fde_tool.py` is the command-line entrypoint.

It parses CLI arguments, loads `config.yaml`, then calls services from `src/python_basics/`.
It should remain thin: command parsing, config lookup, service invocation, and CLI-oriented error codes.

If a capability needs to be available from both CLI and API, put the core logic in `src/python_basics/*_service.py`, then call it from both `fde_tool.py` and `src/api/routers/*`.

## FastAPI Layer

`src/api/` exposes service and prototype-factory capabilities as HTTP APIs.

Important files:

- `main.py`: creates the FastAPI app, registers middleware, exception handlers, and routers.
- `routers/requirement.py`: API wrapper around requirement service.
- `routers/fault.py`: API wrapper around fault report service.
- `routers/excel.py`: API wrapper around Excel summary service.
- `routers/llm.py`: LLM config and structured generation/revision endpoints.
- `routers/method_files.py`: persists method-step Markdown files and exports prototype-generation packages.
- `routers/prototype_projects.py`: writes, validates, builds, and serves generated prototype projects under `prototypes/`.
- `schemas/common.py`: shared API response schema.
- `validators.py`: API input/output validation helpers.
- `exception_handlers.py`: shared FastAPI error handling.

Routers should stay as HTTP adapters: validate requests, call services or local helpers, map exceptions, and return API responses.

If `method_files.py` or `prototype_projects.py` continues to grow, split reusable logic into:

- `src/python_basics/method_file_service.py`
- `src/python_basics/prototype_project_service.py`
- `src/python_basics/prototype_validation_service.py`

## Frontend Prototype Factory

`frontend/` is the Vue 3 + Vite application used to generate prototype-system plans and drive final code generation.

It is not the generated customer prototype itself. It is the factory console.

Important frontend files:

- `frontend/src/App.vue`: global workflow state, method-step routing, Markdown/localStorage restore, and step result persistence.
- `frontend/src/views/RequirementInputView.vue`: step 01, requirement input and analysis.
- `frontend/src/views/ScenarioPageDesignView.vue`: step 02, scenario-to-page design.
- `frontend/src/views/InteractionApiView.vue`: step 03, interaction and API contract design.
- `frontend/src/views/FrontendPrototypeSuggestionView.vue`: step 04, frontend prototype plan, page specs, components, mock schemas, navigation, and generation prompts.
- `frontend/src/views/PrototypeGenerateView.vue`: step 05, orchestrates final prototype generation.
- `frontend/src/generators/`: deterministic generation helpers used by step 05.
- `frontend/src/components/`: shared factory-console UI components.

The frontend may organize generation context and deterministic templates, but filesystem operations, npm build validation, and dev-server startup must go through backend APIs.

## Method Outputs

`prototype_factory/` stores method-chain documentation and runtime outputs.

- `prototype_factory/process_steps/`: method notes, historical process steps, and implementation records.
- `prototype_factory/local_step_outputs/*.md`: saved structured outputs for each workflow step.
- `prototype_factory/local_step_outputs/prototype/*.json`: split JSON assets from step 04, including pages, page specs, API mapping, navigation, components, mocks, plans, and prompts.
- `prototype_factory/local_step_outputs/prototype_generation_package/`: exported zip/README package when requested.

This directory is data and method documentation, not reusable application code.

## Generated Prototypes

`prototypes/` stores runnable generated prototype systems.

Each child directory is a separate Vue/Vite prototype project, for example:

- `prototypes/车辆管理/`
- `prototypes/sea-industry-dispatch/`
- `prototypes/vehicle-dispatch-prototype/`

Generated prototype projects should not depend on `frontend/` or `src/api/`. They should be runnable on their own with `npm install` and `npm run dev/build`.

To improve the quality of future generated prototypes, prefer changing the factory logic in `frontend/src/views/PrototypeGenerateView.vue`, `frontend/src/generators/`, and `src/api/routers/prototype_projects.py` rather than manually editing a generated prototype, unless the task explicitly targets that generated prototype.

## Placement Rules

- Reusable business logic: `src/python_basics/*_service.py`.
- CLI command behavior: `src/python_basics/fde_tool.py`.
- HTTP endpoints: `src/api/routers/*.py`.
- Shared API response/request models: `src/api/schemas/`.
- API input validation: `src/api/validators.py`.
- Prototype-factory workflow UI: `frontend/src/views/`.
- Shared frontend factory components: `frontend/src/components/`.
- Step 05 deterministic generation strategy: `frontend/src/generators/`.
- Step output persistence and export package API: `src/api/routers/method_files.py`.
- Generated prototype filesystem/build/dev-server operations: `src/api/routers/prototype_projects.py`.
- Method-chain saved outputs: `prototype_factory/local_step_outputs/`.
- Final generated prototype projects: `prototypes/{project-slug}/`.

## Current Architecture Notes

The codebase currently has a healthy early-stage separation between:

- Services in `src/python_basics/`.
- API adapters in `src/api/`.
- Factory UI in `frontend/`.
- Runtime method outputs in `prototype_factory/local_step_outputs/`.
- Final prototype outputs in `prototypes/`.

The largest growth point is the prototype-generation path. As generation strategy grows, keep extracting pure generation logic from `PrototypeGenerateView.vue` into `frontend/src/generators/`, and keep backend filesystem safety inside `prototype_projects.py` or a future prototype project service.
