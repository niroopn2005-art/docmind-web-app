@echo off
TITLE DocMind Web App Launcher

echo ===================================================
echo Starting DocMind Application
echo ===================================================
echo.

echo [1/2] Starting FastAPI Backend on port 8000...
start "DocMind Backend" cmd /c ".\venv\Scripts\python.exe main.py || pause"

echo [2/2] Starting Next.js Frontend on port 3000...
cd frontend
start "DocMind Frontend" cmd /c "..\node_bin\node-v20.11.1-win-x64\npm.cmd run dev || pause"
cd ..

echo.
echo ===================================================
echo Both services are successfully launching!
echo Backend API available at: http://localhost:8000
echo Frontend App available at: http://localhost:3000
echo ===================================================
echo.
echo You can now close this launcher window.
pause
