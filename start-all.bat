@echo off
echo Starting NagorikAI Backend...
start cmd /k "cd server && php artisan serve --host=127.0.0.1 --port=8000"

echo Starting NagorikAI Frontend...
start cmd /k "cd client && npm run dev"

echo Done. Backend will be available at http://127.0.0.1:8000
echo Frontend will be available at http://localhost:5173
echo.
echo Please leave the other two command windows open while working.
pause
