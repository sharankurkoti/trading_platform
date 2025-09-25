# Start backend services with docker-compose
Write-Host "Starting backend services..."
docker-compose up -d

# Wait for services to stabilize (adjust time as needed)
Start-Sleep -Seconds 10

# Show service URLs (customize as per your setup)
Write-Host "Backend services should be running at:"
Write-Host "API Gateway: http://localhost:8000"
Write-Host "Trade Exchange Service: http://localhost:8001"
Write-Host "Finance Service: http://localhost:8002"
Write-Host "Loc Service: http://localhost:8003"

# Ask if you want to start the React frontend
$startFrontend = Read-Host "Start React frontend now? (y/n)"

if ($startFrontend -eq "y") {
    Write-Host "Starting React frontend..."
    # Navigate to frontend folder and start react app
    Push-Location .\trading-frontend
    npm start
    Pop-Location
} else {
    Write-Host "Frontend start skipped."
}
