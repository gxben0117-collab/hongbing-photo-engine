$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
$parent = Split-Path -Parent $repo
$sourceDir = Get-ChildItem -Path $parent -Directory | Where-Object {
  Test-Path (Join-Path $_.FullName '56748a86-49ea-4f98-840a-ab50038bbf7d.mp4')
} | Select-Object -First 1
if (-not $sourceDir) {
  throw "Could not find the source media folder next to the project."
}
$source = $sourceDir.FullName
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$work = Join-Path $repo "temp\guizhou_short_$stamp"
$outDir = Join-Path $repo 'output'
$out = Join-Path $outDir 'guizhou_trip_3min.mp4'

New-Item -ItemType Directory -Force -Path $work, $outDir | Out-Null
Push-Location $work

$photos = Get-ChildItem -Path $source -Filter *.jpg | Sort-Object Name
$clips = New-Object System.Collections.Generic.List[string]
$clipIndex = 0

function Assert-Ok {
  param([string]$Step)
  if ($LASTEXITCODE -ne 0) {
    throw "$Step failed with exit code $LASTEXITCODE"
  }
}

function New-ClipName {
  $script:clipIndex++
  return ('clip_{0:D3}.mp4' -f $script:clipIndex)
}

function Add-PhotoClip {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [double]$Seconds = 2.0
  )

  $frames = [int][Math]::Round($Seconds * 30)
  $name = New-ClipName
  $vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0012,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,eq=contrast=1.04:saturation=1.08,format=yuv420p"
  & ffmpeg -y -hide_banner -loglevel error -loop 1 -i $Path -vf $vf -frames:v $frames -an -c:v libx264 -preset veryfast -crf 20 $name
  Assert-Ok "photo clip"
  $script:clips.Add($name)
}

function Add-PhotoRange {
  param(
    [int]$Start,
    [int]$End
  )

  for ($i = $Start; $i -le $End -and $i -lt $photos.Count; $i++) {
    Add-PhotoClip -Path $photos[$i].FullName -Seconds 2.0
  }
}

function Add-VideoClip {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [double]$Start = 0,
    [double]$Seconds = 10
  )

  $name = New-ClipName
  $vf = "[0:v]split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=28,eq=brightness=-0.10:saturation=0.92[bg];[fg]scale=1080:1920:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,eq=contrast=1.04:saturation=1.05,format=yuv420p,fps=30[v]"
  & ffmpeg -y -hide_banner -loglevel error -ss $Start -t $Seconds -i $Path -filter_complex $vf -map '[v]' -an -c:v libx264 -preset veryfast -crf 20 $name
  Assert-Ok "video clip"
  $script:clips.Add($name)
}

function Add-EndingClip {
  param([string]$Path)

  $name = New-ClipName
  $vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0007,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1080x1920:fps=30,eq=brightness=-0.06:contrast=1.05:saturation=1.05,format=yuv420p"
  & ffmpeg -y -hide_banner -loglevel error -loop 1 -i $Path -vf $vf -frames:v 120 -an -c:v libx264 -preset veryfast -crf 20 $name
  Assert-Ok "ending clip"
  $script:clips.Add($name)
}

$videoBridge = Join-Path $source '56748a86-49ea-4f98-840a-ab50038bbf7d.mp4'
$videoLongA = Join-Path $source '6f0e80da-c26c-4b00-be8e-20998d6a8548.mp4'
$videoLongB = Join-Path $source '9dd631f2-484c-4560-9f5f-6b8c92df7ba3.mp4'

Add-PhotoRange 0 8
Add-VideoClip -Path $videoBridge -Start 2 -Seconds 14
Add-PhotoRange 9 18
Add-VideoClip -Path $videoLongB -Start 60 -Seconds 20
Add-PhotoRange 19 30
Add-VideoClip -Path $videoLongA -Start 58 -Seconds 20
Add-PhotoRange 31 45
Add-VideoClip -Path $videoLongA -Start 0 -Seconds 12
Add-PhotoRange 46 ($photos.Count - 1)
Add-EndingClip -Path $photos[0].FullName

$concat = Join-Path $work 'concat.txt'
$concatLines = $clips | ForEach-Object { "file '$($_)'" }
Set-Content -Path $concat -Value $concatLines -Encoding ASCII

Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'guizhou_captions.ass') -Destination (Join-Path $work 'captions.ass') -Force

& ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i $concat -vf "ass=captions.ass" -t 180 -an -c:v libx264 -preset veryfast -crf 19 -movflags +faststart silent_video.mp4
Assert-Ok "silent video render"

& ffmpeg -y -hide_banner -loglevel error `
  -f lavfi -i "sine=frequency=110:duration=180:sample_rate=48000" `
  -f lavfi -i "sine=frequency=220:duration=180:sample_rate=48000" `
  -f lavfi -i "sine=frequency=330:duration=180:sample_rate=48000" `
  -f lavfi -i "sine=frequency=440:duration=180:sample_rate=48000" `
  -filter_complex "[0:a]volume=0.050[a0];[1:a]volume=0.035[a1];[2:a]volume=0.025[a2];[3:a]volume=0.018,tremolo=f=3.2:d=0.35[a3];[a0][a1][a2][a3]amix=inputs=4:duration=longest,afade=t=in:st=0:d=3,afade=t=out:st=174:d=6,volume=0.9[a]" `
  -map "[a]" -c:a aac -b:a 160k bgm.m4a
Assert-Ok "music render"

& ffmpeg -y -hide_banner -loglevel error -i silent_video.mp4 -i bgm.m4a -map 0:v -map 1:a -t 180 -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart $out
Assert-Ok "final mux"

Pop-Location
Write-Host "DONE: $out"
