# Save Puppy - Script de sincronización de IP local
# Detecta la IP actual de la Wi-Fi y actualiza todos los archivos necesarios

Write-Host "Detectando IP actual de Wi-Fi..." -ForegroundColor Cyan

# Obtener la dirección IP de la interfaz Wi-Fi activa
$CurrentIP = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" | Select-Object -ExpandProperty IPAddress -First 1

if (-not $CurrentIP) {
    Write-Error "No se pudo detectar una dirección IP de Wi-Fi. Verifica que estés conectado."
    exit 1
}

Write-Host "Nueva IP detectada: $CurrentIP" -ForegroundColor Green

# Definir los archivos a actualizar (rutas relativas a la raíz del proyecto)
$FilesToUpdate = @(
    "frontend/projects/mobile-app/src/environments/environment.ts",
    "frontend/projects/mobile-app/src/environments/environment.prod.ts",
    "frontend/projects/mobile-app/android/app/src/main/res/xml/network_security_config.xml"
)

# Regex para detectar el patrón de la IP local (asumiendo formato 192.168.1.N)
# O simplemente cualquier IP para ser más robusto
$IpRegex = "\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"

foreach ($FilePath in $FilesToUpdate) {
    $FullPath = Join-Path (Get-Location) $FilePath
    if (Test-Path $FullPath) {
        Write-Host "Actualizando: $FilePath" -ForegroundColor Yellow
        $Content = Get-Content $FullPath -Raw
        $NewContent = $Content -replace $IpRegex, $CurrentIP
        Set-Content $FullPath $NewContent
    } else {
        Write-Warning "No se encontró el archivo: $FilePath"
    }
}

# Sincronizar con Capacitor
Write-Host "Sincronizando con Capacitor..." -ForegroundColor Cyan
Set-Location "frontend"
try {
    # Ejecutamos con --quiet o redirigiendo salida para no saturar
    npx cap sync mobile-app
    Write-Host "Sincronización exitosa." -ForegroundColor Green
} catch {
    Write-Error "Error al sincronizar con Capacitor."
}

Set-Location ".."
Write-Host "--- Proceso completado ---" -ForegroundColor Green
Write-Host "Ahora puedes abrir Android Studio / Xcode y desplegar la app."
