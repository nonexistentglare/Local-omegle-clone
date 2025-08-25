@echo off
echo Activating virtual environment...
call ..\venv\Scripts\activate
cd ..
echo Starting backend...
uvicorn backend.main:app --reload
pause
