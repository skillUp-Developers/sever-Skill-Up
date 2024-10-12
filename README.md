# Backend Project Setup with Node.js, Prisma, PostgreSQL, and TypeScript

## Project Overview

This backend project uses **Node.js**, **TypeScript**, and **Prisma** ORM, with **PostgreSQL** as the database. The project follows best practices for environment-based configuration using a `.env` file.

## Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (v16.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12.x or higher)
- [Prisma](https://www.prisma.io/docs/getting-started)
- [Git](https://git-scm.com/) (for version control)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/skillUp-Developers/sever-Skill-Up.git
cd your-repository-name

```
npm i
```

# Environment Configuration

# Server
PORT=5000

# PostgreSQL Database
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<dbname>?schema=public"

# Prisma settings
PRISMA_LOG_LEVEL=info

# Additional Environment Variables (Optional)
NODE_ENV=development
