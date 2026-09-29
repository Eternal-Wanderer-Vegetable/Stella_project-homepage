$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8645)
$listener.Start()
Write-Output "serving on 8645"
while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    while (($line = $reader.ReadLine()) -ne $null -and $line -ne "") {}
    $html = [System.IO.File]::ReadAllText("F:\SMBD\Stella_project-homepage\index.html")
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
    $header = "HTTP/1.1 200 OK`r`nContent-Type: text/html; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Flush()
  } catch { Write-Output $_.Exception.Message }
  finally { $client.Close() }
}
