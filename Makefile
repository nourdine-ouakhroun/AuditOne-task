# -------------------------------
# Project configuration
# -------------------------------
BACKEND_DIR=BackEnd
FRONTEND_DIR=FrontEnd
PYTHON=python3
VENV=$(BACKEND_DIR)/venv
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000

# -------------------------------
# Backend commands
# -------------------------------

# Create virtual environment and install dependencies
setup-backend:
	@echo "🚀 Setting up backend environment..."
	@cd $(BACKEND_DIR) && $(PYTHON) -m venv venv
	@cd $(BACKEND_DIR) && . venv/bin/activate && pip install -U pip && pip install -r requirements.txt
	@echo "✅ Backend setup complete."

# Run the backend server
run-backend:
	@echo "🔧 Starting FastAPI backend..."
	@cd $(BACKEND_DIR) && . venv/bin/activate && uvicorn app.main:app --host $(BACKEND_HOST) --port $(BACKEND_PORT) --reload

# -------------------------------
# Frontend commands
# -------------------------------

# Install frontend dependencies
setup-frontend:
	@echo "📦 Installing frontend dependencies..."
	@cd $(FRONTEND_DIR) && npm install
	@echo "✅ Frontend setup complete."

# Run the React development server
run-frontend:
	@echo "🌐 Starting React frontend..."
	@cd $(FRONTEND_DIR) && npm run dev

# -------------------------------
# Combined commands
# -------------------------------

# Run both frontend and backend simultaneously
all:
	@echo "🚀 Launching backend and frontend..."
	@make -j 2 run-backend run-frontend

# Install everything (backend + frontend)
setup-all: setup-backend setup-frontend

# -------------------------------
# Utility commands
# -------------------------------

# Stop any running services (Linux/Mac)
stop:
	@echo "🛑 Stopping backend and frontend..."
	@pkill -f "uvicorn" || true
	@pkill -f "react-scripts" || true
	@echo "✅ All services stopped."

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build and cache files..."
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@rm -rf $(FRONTEND_DIR)/node_modules $(BACKEND_DIR)/venv
	@echo "✅ Cleanup done."

# -------------------------------
# Help command
# -------------------------------
help:
	@echo ""
	@echo "Available commands:"
	@echo "  make setup-backend     - Create venv & install backend dependencies"
	@echo "  make setup-frontend    - Install frontend dependencies"
	@echo "  make setup-all         - Setup both backend and frontend"
	@echo "  make run-backend       - Run backend API server"
	@echo "  make run-frontend      - Run React dev server"
	@echo "  make run-all           - Run backend + frontend together"
	@echo "  make stop              - Stop running services"
	@echo "  make clean             - Remove build/cache files"
	@echo "  make help              - Show this help menu"
	@echo ""
