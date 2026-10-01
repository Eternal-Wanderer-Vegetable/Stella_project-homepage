$root = "F:\SMBD\Stella_project-homepage"
$types = @{
  ".html" = "text/html; charset=utf-8"; ".js" = "text/javascript"; ".css" = "text/css"
  ".jpg"  = "image/jpeg"; ".jpeg" = "image/jpeg"; ".png" = "image/png"
  ".svg"  = "image/svg+xml"; ".ico" = "image/x-icon"; ".webp" = "image/webp"
}
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8645)
$listener.Start()
Write-Output "serving $root on 8645"
while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $client.ReceiveTimeout = 3000
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    if ($null -eq $requestLine) { continue }
    while (($line = $reader.ReadLine()) -ne $null -and $line -ne "") {}
    $path = ($requestLine -split ' ')[1] -replace '\?.*$', ''
    if ($path -eq "/") { $path = "/index.html" }
    $full = [System.IO.Path]::GetFullPath((Join-Path $root ($path -replace '/', '\')))
    if (-not $full.StartsWith($root) -or -not (Test-Path $full) -or (Get-Item $full).PSIsContainer) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 not found")
      $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      $stream.Write([System.Text.Encoding]::ASCII.GetBytes($header), 0, $header.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    } else {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ctype = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $header = "HTTP/1.1 200 OK`r`nContent-Type: $ctype`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
      $stream.Write([System.Text.Encoding]::ASCII.GetBytes($header), 0, $header.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    }
    $stream.Flush()
  } catch { Write-Output $_.Exception.Message }
  finally { $client.Close() }
}
