param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$Email = "manager@techstore.com",
    [string]$Password = "password",
    [string]$PromotionId = ""
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function To-PrettyJson($Value) {
    return ($Value | ConvertTo-Json -Depth 20)
}

try {
    Write-Step "Logging in as $Email"
    $loginBody = @{
        email = $Email
        password = $Password
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Method Post `
        -Uri "$BaseUrl/api/auth/login" `
        -ContentType "application/json" `
        -Body $loginBody

    if (-not $login.accessToken) {
        throw "Login response does not contain accessToken."
    }

    Write-Host "Role: $($login.role)"
    Write-Host "User: $($login.email) [$($login.userId)]"

    $headers = @{
        Authorization = "Bearer $($login.accessToken)"
    }

    Write-Step "Loading promotions"
    $promotionsResponse = Invoke-RestMethod -Method Get `
        -Uri "$BaseUrl/api/promotions" `
        -Headers $headers

    $promotions = if ($null -ne $promotionsResponse.value) {
        @($promotionsResponse.value)
    } else {
        @($promotionsResponse)
    }

    if ($promotions.Count -eq 0) {
        throw "No promotions returned from /api/promotions."
    }

    $targetPromotion = $null
    if ($PromotionId) {
        $targetPromotion = $promotions | Where-Object { $_.id -eq $PromotionId } | Select-Object -First 1
        if (-not $targetPromotion) {
            Write-Host "PromotionId not found in list, calling /api/promotions/$PromotionId directly." -ForegroundColor Yellow
            $targetPromotion = Invoke-RestMethod -Method Get `
                -Uri "$BaseUrl/api/promotions/$PromotionId" `
                -Headers $headers
        }
    } else {
        $targetPromotion = $promotions | Select-Object -First 1
    }

    Write-Host "Target promotion: $($targetPromotion.code) / $($targetPromotion.name)"

    Write-Step "Loading promotion performance"
    $performance = Invoke-RestMethod -Method Get `
        -Uri "$BaseUrl/api/promotions/$($targetPromotion.id)/performance" `
        -Headers $headers

    Write-Host ""
    Write-Host "Performance result:" -ForegroundColor Green
    Write-Host (To-PrettyJson $performance)

    Write-Host ""
    Write-Host "Checks:" -ForegroundColor Green
    Write-Host ("- usageCount = {0}" -f $performance.usageCount)
    Write-Host ("- totalDiscountAmount = {0}" -f $performance.totalDiscountAmount)
    Write-Host ("- totalOrderAmount = {0}" -f $performance.totalOrderAmount)
    Write-Host ("- averageDiscountAmount = {0}" -f $performance.averageDiscountAmount)
}
catch {
    Write-Host ""
    Write-Host "Test failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed
    }
    exit 1
}
