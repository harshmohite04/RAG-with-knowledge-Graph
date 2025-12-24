# Node.js Backend Project

This is a structured Node.js backend using Express.js and MongoDB (via Mongoose).

## Structure

- `src/app.js`: Application entry point with middleware and routes.
- `src/config/`: Configuration files and environment variables handling.
- `src/controllers/`: Request logic.
- `src/routes/`: API route definitions.
- `src/models/`: Database models (e.g., Mongoose schemas).
- `src/middlewares/`: Custom middlewares.
- `server.js`: Server startup script.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory (copy from `.env.example` if available) and set `PORT` (default 3000).

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

4.  **Run Production Server:**
    ```bash
    npm start
    ```

## API Endpoints

- **GET /**: Health check.
- **GET /api/v1/example**: Example route.
