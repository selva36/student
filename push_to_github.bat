@echo off
title Push Student Management System to GitHub
color 0b
echo ========================================================
echo   Student Management System - GitHub Push Assistant
echo ========================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b
)

:: Prompt for GitHub Repository URL
echo Please enter your GitHub Repository URL.
echo Example: https://github.com/your-username/student-management-system.git
echo.
set /p REPO_URL="Enter GitHub Repo URL: "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] Repository URL cannot be empty!
    pause
    exit /b
)

echo.
echo [1/4] Staging all files...
git add .

echo [2/4] Committing changes...
git commit -m "Complete Student Management System (Java Servlets, JDBC, MySQL, HTML5/CSS3/JS)" 2>nul

echo [3/4] Setting main branch and remote origin...
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [4/4] Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Project successfully pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo [NOTE] If push failed due to authentication or existing repo,
    echo try running: git push -u origin main --force
)

echo.
pause

