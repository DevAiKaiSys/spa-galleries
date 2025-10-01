# Project Structure

```
project-root/
├── README.md
├── .env.example
│
├── docker_frontend/
│   ├── docker-compose.yml          # 🟦 Frontend only
│   ├── Dockerfile
│   ├── .env.example
├── docker_backend/
│   ├── docker-compose.yml          # 🟩 Backend + MySQL
│   ├── Dockerfile
│   ├── .env.example
├── frontend/                        # Next.js
│   ├── .env.example
│   ├── package.json
│   └── src/
│
└── backend/                         # NestJS
    ├── .env.example
    ├── package.json
    ├── src/
```
