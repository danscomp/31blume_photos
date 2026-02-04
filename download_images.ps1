$jsonPath = "assets.json"
if (-not (Test-Path $jsonPath)) {
    Write-Error "assets.json not found"
    exit 1
}

$jsonContent = Get-Content $jsonPath -Raw
if ($jsonContent.StartsWith("while (1) {}")) {
    $jsonContent = $jsonContent.Substring(12)
}
$json = $jsonContent | ConvertFrom-Json

$base = $json.base
$destDir = "assets\images\gallery"

if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

$count = 0
foreach ($res in $json.resources) {
    if ($res.type -eq "album_asset" -and $res.asset.subtype -eq "image") {
        $links = $res.asset.links
        $rendition = $links."/rels/rendition_type/2048"
        
        if ($rendition) {
            $href = $rendition.href
            $fullUrl = $base + $href
            
            $name = $res.asset.payload.importSource.fileName
            if (-not $name) { $name = $res.id }
            $name = $name -replace "\.[^.]+$", ".jpg"
            
            $outFile = Join-Path $destDir $name
            
            Write-Host "Downloading $name..."
            
            # Using curl.exe with the API header
            $proc = Start-Process -FilePath "curl.exe" -ArgumentList "-s", "-H", '"X-API-Key: LightroomMobileWeb1"', "$fullUrl", "-o", "$outFile" -Wait -PassThru
            
            if ($proc.ExitCode -eq 0) {
                $count++
            } else {
                Write-Error "Failed to download $name. Exit code: $($proc.ExitCode)"
            }
        }
    }
}

Write-Host "Total images downloaded: $count"
