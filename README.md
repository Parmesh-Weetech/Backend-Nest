# 🏗 Organization based RBAC

## 📋 Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (if using Dockerized services like Postgres)

---

## 🔗 1. Clone the Repository

```bash
git clone git@github.com:Parmesh-Weetech/Backend-Nest.git
cd Backend-Nest
```
## 🔗 2. Check Out a Branch

### List all remote branches:
```bash
git fetch --all
git branch -a
```

### Switch to a specific feature branch:
```bash
git checkout feature/branch-name
```
## 🔗 3. Install Dependencies

### Install Node.js packages:

```bash
npm install
# or
yarn install
```

## 🔗 4. Set Environment Variables

### env variables are already set. Just renamed the `.sample.env` file to `.env`

## 🔗 5. Run the Application

```bash
npm run start:dev
# or
yarn start:dev
```
### The server will start on the port specified in .env (default: 3000).
### Access the API at: `http://localhost:3000/`

## 🔗 6. Using Docker

### If your project uses Docker (e.g., Postgres database):
```bash
sudo docker-compose up -d
```

### Stop Docker containers:
```bash
sudo docker-compose down
```
## 🔗 7. Updating Your Project

Pull the latest changes from a branch:
```bash
git checkout <branch_name>
git pull origin <branch_name>
```


### ✅ This setup ensures you can clone, install dependencies, switch branches, and start the NestJS app quickly.
