@echo off

if exist ".\node_modules\" if exist ".\package-lock.json" (
    npm run start

    if %errorlevel% neq 0 (
        echo Error: An error occurred while starting.
        exit /b %errorlevel%
    ) else (
        echo Started successfully.
    )
) else (
    echo Installing dependencies...
    npm install

    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies.
        exit /b %errorlevel%
    ) else (
        echo Correctly installed dependencies. Running the program...
        npm run start

        if %errorlevel% neq 0 (
            echo Error: An error occurred while starting.
            exit /b %errorlevel%
        ) else (
            echo Started successfully.
        )
    )
)

pause
