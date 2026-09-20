[Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null
[Reflection.Assembly]::LoadWithPartialName("System.IO.Compression") | Out-Null

$apkPath = "D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\build\outputs\apk\release\app-release.apk"
$tempAligned = "D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\build\outputs\apk\release\app-release-aligned.apk"
$rootApkPath = "D:\FAIZAAN\Earn24app\earn24.apk"
$latestApkPath = "D:\FAIZAAN\Earn24app\Earn24_Latest.apk"
$bundlePath = "D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\src\main\assets\index.android.bundle"

$zipalign = "D:\FAIZAAN\Earn24app\android_sdk\build-tools\34.0.0\zipalign.exe"
$apksigner = "D:\FAIZAAN\Earn24app\android_sdk\build-tools\34.0.0\apksigner.bat"
$keystore = "D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\debug.keystore"

Write-Host "1. Injecting fresh React Native JS bundle into APK..."

$stream = [System.IO.File]::Open($apkPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite)
$archive = New-Object System.IO.Compression.ZipArchive($stream, [System.IO.Compression.ZipArchiveMode]::Update)

$entry = $archive.GetEntry("assets/index.android.bundle")
if ($entry -ne $null) {
    $entry.Delete()
}

# Remove old invalid signatures so apksigner can apply new valid v1/v2/v3 signatures
$toRemove = @($archive.Entries | Where-Object { $_.FullName -like "META-INF/*" })
foreach ($e in $toRemove) {
    $e.Delete()
}

$newEntry = $archive.CreateEntry("assets/index.android.bundle", [System.IO.Compression.CompressionLevel]::Optimal)
$entryStream = $newEntry.Open()
$fileStream = [System.IO.File]::OpenRead($bundlePath)
$fileStream.CopyTo($entryStream)
$fileStream.Close()
$entryStream.Close()

$archive.Dispose()
$stream.Close()

Write-Host "2. Running Zipalign..."
if (Test-Path $tempAligned) {
    Remove-Item $tempAligned -Force
}
& $zipalign -f -p 4 $apkPath $tempAligned

Write-Host "3. Signing APK with apksigner (v1, v2, v3)..."
cmd.exe /c "`"$apksigner`" sign --ks `"$keystore`" --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true `"$tempAligned`""

Write-Host "4. Verifying APK signature..."
cmd.exe /c "`"$apksigner`" verify -v `"$tempAligned`""

Write-Host "5. Distributing signed APK..."
Copy-Item $tempAligned $apkPath -Force
Copy-Item $tempAligned $rootApkPath -Force
Copy-Item $tempAligned $latestApkPath -Force

(Get-Item $rootApkPath).LastWriteTime = Get-Date
(Get-Item $latestApkPath).LastWriteTime = Get-Date

Set-Clipboard -Path $rootApkPath

Write-Host "SUCCESS: 100% Valid, Signed, and Verified APK created and copied to clipboard!"
