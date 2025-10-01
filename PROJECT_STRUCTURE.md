# Project Structure

```
project-root/
├── README.md
├── .env.example
│
├── frontend/                        # Next.js
│   ├── docker-compose.yml          # 🟦 Frontend only
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── src/
│
└── backend/                         # NestJS + MySQL
    ├── docker-compose.yml          # 🟩 Backend + MySQL
    ├── Dockerfile
    ├── .env.example
    ├── package.json
    ├── src/
    └── mysql/
        └── init.sql
```
