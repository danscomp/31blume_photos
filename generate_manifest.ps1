
$galleryPath = "assets/images/gallery"
$albums = Get-ChildItem -Path $galleryPath -Directory

$manifest = @{}

foreach ($album in $albums) {
    $files = Get-ChildItem -Path $album.FullName -Filter *.jpg | Select-Object -ExpandProperty Name
    $manifest[$album.Name] = $files
}

$json = $manifest | ConvertTo-Json -Depth 2
$jsContent = "const GALLERY_DATA = $json;"

# Clean up path to be relative web path if necessary, but filenames alone are fine if we prepend path in JS
# Actually, ConvertTo-Json will make a nice object: { "branding": ["file1.jpg", ...], ... }

Set-Content -Path "assets/js/gallery_data.js" -Value $jsContent
Write-Host "Generated assets/js/gallery_data.js"
