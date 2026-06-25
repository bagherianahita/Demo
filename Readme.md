# Trust Debugger Demo
 <img width="874" height="611" alt="image" src="https://github.com/user-attachments/assets/efd136a3-746f-4d27-abdc-54c90d8bad5e" />


**Companion demo** for [Debugger-Auditor-Service](https://github.com/bagherianahita/Debugger-Auditor-Service) — Express API + HTML UI for trust-scoring scenario audits.

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)

## Architecture

```
Browser (index.html) ──POST /debug/audit──► Express (app.js)
                                                    │
                                         auditor/trustLogicAuditor.js
                                         auditor/scenarios.js (S01–S04)
```

## Quick start

```bash
npm install
npm start    # http://localhost:4100
```

The browser UI opens with **preset scenarios** and auto-runs an audit on load. Use **Contradiction case** to see detected logic failures, or **Clean case** for a passing audit.

| | URL |
|---|---|
| **Web UI** | http://localhost:4100 |
| **Health check** | http://localhost:4100/health |

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/debug/audit` | Single audit |
| `POST` | `/debug/batch-audit` | Batch audit |

## License

MIT — see [LICENSE](LICENSE).
