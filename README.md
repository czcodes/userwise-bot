
# DevOps Chatbot

An AI assistant for Airflow, MongoDB, and Kubernetes.

## Features

- User authentication and management
- Chat interface for DevOps assistance
- Credential management for various services
- Admin panel with analytics
- Role-based access control

## Getting Started

### Prerequisites

- Node.js 16+ for the frontend
- Python 3.8+ for the backend
- npm or yarn

### Running Both Servers Together

You can run both the frontend and backend servers simultaneously using:

```bash
# Make the script executable first
chmod +x start-dev.sh

# Run both servers
./start-dev.sh
```

This will start the backend at http://localhost:8000 and the frontend at http://localhost:5173

### Backend Setup

1. Navigate to the API directory:
   ```
   cd api
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   python run.py
   ```

The API will be available at http://localhost:8000

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to http://localhost:5173

## Default Credentials

- Admin User:
  - Email: john@example.com
  - Password: password123

- Regular User:
  - Email: jane@example.com
  - Password: password456

## API Documentation

Once the backend is running, you can access the API documentation at:
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/redoc - ReDoc UI
