# Super Version Control & Collaboration Strategy

## 1. Team Roster & Git Identifiers

| Contributor | Student ID | GitHub Username | Role & Scope |
| :--- | :--- | :--- | :--- |
| **Imranul Islam Sihab** | 232-35-733 | `@imransihab0` | **Team Lead**: Backend API, Agentic AI Tool Loop, Convex Schema & Functions, Pricing Arithmetic Engine, Frontend Design Specifications. |
| **Imtiaz Ibna Kamal** | 232-35-680 | `@imtiazdeepto` | **ML Engineer**: Dataset Curation, 4 Model Comparison (RF, XGB, LR, SVM), FastAPI Inference Microservice, Model Evaluation & Metrics. |
| **Sharmarke Abdi Abdullahi** | 232-35-808 | `@zharmo` | **Frontend & Offline Engineer**: Neo-brutalist Web Client, React Bits/Motion Primitives, Service Worker Offline Cache, Document Corpus Ingestion. |

---

## 2. Super Version Control Protocol

To ensure clear authorship, traceability, and regular progress for the capstone supervisor and examiners:
1. **Incremental Pushes**: Avoid large monolithic commits. Work must be split into logical increments and pushed frequently.
2. **Dedicated Branching Model**:
   - `main`: Production-ready, verified code. All tests passing.
   - `feat/api-agent-convex` (`@imransihab0`): Backend routes, agent orchestrator, Convex functions.
   - `feat/ml-inference` (`@imtiazdeepto`): Model training, Jupyter notebooks, FastAPI microservice.
   - `feat/frontend-offline` (`@zharmo`): Neo-brutalist UI, components, offline Service Worker, client state.
3. **Structured Commit Message Standard (Conventional Commits)**:
   - `feat(scope): message` — New capability or screen.
   - `fix(scope): message` — Bug resolution.
   - `docs(scope): message` — Architecture, specs, or task updates.
   - `test(scope): message` — Unit or integration test suites.
   - `refactor(scope): message` — Code cleanup without behavior change.
   - `chore(scope): message` — Dependency, config, or build scripts.

---

## 3. Pull & Sync Protocol for Teammates

Before starting any task, each teammate pulls the latest state from `origin/main`:
```bash
# Fetch latest remote references and branch updates
git fetch origin

# Rebase or merge main into your active feature branch
git checkout feat/<your-feature>
git pull origin main --rebase
```

Each teammate has a personalized AI Context file under `team/<github-username>/` so that any AI tool or IDE assistant they use immediately receives their scope, prompts, and active tasks.
