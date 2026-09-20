[Reflection.Assembly]::LoadWithPartialName(System.IO.Compression.FileSystem) | Out-Null
[Reflection.Assembly]::LoadWithPartialName(System.IO.Compression) | Out-Null

$zipalign = D:\FAIZAAN\Earn24app\android_sdk\build-tools\34.0.0\zipalign.exe
$apksigner = D:\FAIZAAN\Earn24app\android_sdk\build-tools\34.0.0\apksigner.bat
$keystore = D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\debug.keystore

$rawApk = D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\build\outputs\apk\release\app-release.apk
$tempAlignedApk = D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\build\outputs\apk\release\app-release-aligned.apk
$rootApk = D:\FAIZAAN\Earn24app\earn24.apk
$latestApk = D:\FAIZAAN\Earn24app\Earn24_Latest.apk
$bundlePath = D:\FAIZAAN\Earn24app\frontend\MyApp\android\app\src\main\assets\index.android.bundle

Write-Host --- Step 1: Injecting Fresh JS Bundle into Base APK ---
$stream = [System.IO.File]::Open($rawApk, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite)
$archive = New-Object System.IO.Compression.ZipArchive($stream, [System.IO.Compression.ZipArchiveMode]::Update)

$entry = $archive.GetEntry(assets/index.android.bundle)
if ($entry -ne $null) {
    $entry.Delete()
}

$metaEntries = @($archive.Entries | Where-Object { $_.FullName -like META-INF/* })
foreach ($m in $metaEntries) {
    $m.Delete()
}

$newEntry = $archive.CreateEntry(assets/index.android.bundle, [System.IO.Compression.CompressionLevel]::Optimal)
$entryStream = $newEntry.Open()
$fileStream = [System.IO.File]::OpenRead($bundlePath)
$fileStream.CopyTo($entryStream)
$fileStream.Close()
$entryStream.Close()

$archive.Dispose()
$stream.Close()

Write-Host --- Step 2: Running Zipalign ---
if (Test-Path $tempAlignedApk) {
    Remove-Item $tempAlignedApk -Force
}
& $zipalign -f -p 4 $rawApk $tempAlignedApk

Write-Host --- Step 3: Signing with apksigner (v1, v2, v3) ---
& cmd.exe /c "$apksigner sign --ks $keystore --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true $tempAlignedApk

Write-Host --- Step 4: Verifying Signature ---
& cmd.exe /c $apksigner verify -v $tempAlignedApk

Write-Host --- Step 5: Distributing Final Signed APK ---
Copy-Item $tempAlignedApk $rawApk -Force
Copy-Item $tempAlignedApk $rootApk -Force
Copy-Item $tempAlignedApk $latestApk -Force

(Get-Item $rootApk).LastWriteTime = Get-Date
(Get-Item $latestApk).LastWriteTime = Get-Date

Set-Clipboard -Path $rootApk

Write-Host SUCCESS: 100% Valid Signed APK created and copied to clipboard!
