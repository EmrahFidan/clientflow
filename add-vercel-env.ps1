# Vercel Environment Variables - Simple Script
Write-Host "Vercel Environment Variables ekleniyor..." -ForegroundColor Green
Write-Host ""

# .env.local dosyasini oku
$envContent = Get-Content .env.local -Raw

# Parse values
$apiKey = if ($envContent -match 'NEXT_PUBLIC_FIREBASE_API_KEY=(.*)') { $matches[1].Trim() }
$authDomain = if ($envContent -match 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=(.*)') { $matches[1].Trim() }
$projectId = if ($envContent -match 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.*)') { $matches[1].Trim() }
$storageBucket = if ($envContent -match 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=(.*)') { $matches[1].Trim() }
$messagingSenderId = if ($envContent -match 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=(.*)') { $matches[1].Trim() }
$appId = if ($envContent -match 'NEXT_PUBLIC_FIREBASE_APP_ID=(.*)') { $matches[1].Trim() }
$groqKey = if ($envContent -match 'GROQ_API_KEY=(.*)') { $matches[1].Trim() }

Write-Host "Degerler okundu:" -ForegroundColor Yellow
Write-Host "  Firebase API Key: $($apiKey.Substring(0,20))..."
Write-Host "  Groq API Key: $($groqKey.Substring(0,15))..."
Write-Host ""

# Add each variable
$vars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = $apiKey
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = $authDomain
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = $projectId
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = $storageBucket
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = $messagingSenderId
    "NEXT_PUBLIC_FIREBASE_APP_ID" = $appId
    "GROQ_API_KEY" = $groqKey
}

foreach ($varName in $vars.Keys) {
    Write-Host "Ekleniyor: $varName" -ForegroundColor Cyan
    $value = $vars[$varName]

    # Vercel'e ekle (interaktif)
    Write-Output $value | vercel env add $varName

    Write-Host "Tamamlandi!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "TAMAM! Simdi deploy et: vercel --prod" -ForegroundColor Green
