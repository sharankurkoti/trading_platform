# Modernize all microservices with Poetry and latest dependencies

$ErrorActionPreference = 'Stop'

$services = @(
    'loc-service',
    'trade-exchange-service',
    'finance-service',
    'user-service',
    'auth-service',
    'api-gateway',
    'services/example_service'
)

$root = "${PSScriptRoot}\.."
$pyver = "^3.12"

foreach ($svc in $services) {
    $svcPath = Join-Path $root $svc
    if (Test-Path "$svcPath/requirements.txt") {
        Write-Host "Modernizing $svc..."
        Push-Location $svcPath
        poetry init --no-interaction --python=$pyver
        if ($svc -eq 'loc-service' -or $svc -eq 'finance-service') {
            poetry add fastapi sqlalchemy[asyncio] asyncpg pydantic pytest pytest-asyncio coverage ruff black python-jose[cryptography] httpx
        } elseif ($svc -eq 'trade-exchange-service') {
            poetry add fastapi httpx pytest pytest-asyncio coverage ruff black
        } elseif ($svc -eq 'user-service') {
            poetry add fastapi pydantic pytest pytest-asyncio coverage ruff black python-jose[cryptography] httpx
        } else {
            poetry add fastapi pydantic pytest pytest-asyncio coverage ruff black httpx
        }
        poetry add --dev pre-commit
        Pop-Location
    }
}

Write-Host "Modernization complete. Review pyproject.toml files and remove requirements.txt if migration is successful."
