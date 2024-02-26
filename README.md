---

# dZENcode Test Project

## Introduction

This project is a test project for dZENcode. It includes an application for posting comments. It uses Redis for caching and queues, and Elasticsearch as a database. The frontend is built with React, and the backend uses Express.js.

## Setup

Before running the project, you need to start a Redis server. If you don't have Redis installed, you can use Docker to run it:

```bash
# If you need to download Redis (Docker)
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest

# If you already have Redis installed (Docker)
docker run -p 6379:6379 redis-container-name
```

## Installation

To install the project dependencies, run:

```bash
yarn install
```

## Usage

To start the project, use the following command:

```bash
yarn start
```

This will launch your project, and you can access it at `http://localhost:PORT` in your browser.

## Technologies Stack

- Frontend: React
- Backend: Express.js
- Caching: Redis
- Database: Elasticsearch

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
