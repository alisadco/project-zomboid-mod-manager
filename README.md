# Project Zomboid Mod Manager

A web-based tool to help manage Project Zomboid mods by allowing users to input Steam Workshop collections or mod IDs, view details, and generate server configurations.

![Overview](/screenshots/overview.png)

---

## Features

- Fetch mods by Steam Workshop collection ID or individual mod ID.
- Add or remove individual mods and maps
- Generate and copy `server.ini`-compatible mod configurations.
- Summarizes used maps. ![Map list](/screenshots/maps.png)

---

## Prerequisites

### Without Docker

- **Node.js** and **npm** (for React frontend)
- **Java 17+** (for Spring Boot backend)
- **Maven** (for building the backend)

### With Docker

- **Docker**
- **Docker Compose** (optional, for multi-container setups)

---

## Running the App Locally (Without Docker)

### 1. Clone the Repository

```sh
git clone https://github.com/alisadco/project-zomboid-mod-manager
cd project-zomboid-mod-manager
```

### 2. Set Up Environment Variables

Create a .env file in the frontend directory with the following content:

```sh
REACT_APP_API_URL=http://localhost:8080
```

### 3. Install Dependencies

Backend

```sh
cd backend
mvn clean install
```

Frontend

```sh
cd frontend
npm install
```

### 4. Start the App

Backend

```sh
cd backend
mvn spring-boot:run
```

Frontend

```sh
cd frontend
npm start
```

## Running the App with Docker

### 1. Build Docker Images

```sh
docker-compose build
```

### 2. Run Containers

Create a .env file in the frontend directory with the following content:

```sh
docker-compose up
```
