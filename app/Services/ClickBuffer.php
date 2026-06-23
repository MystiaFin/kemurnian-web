<?php

namespace App\Services;

class ClickBuffer
{
    protected string $path;

    public function __construct()
    {
        $this->path = storage_path('app/clicks/buffer.json');

        if (!is_dir(dirname($this->path))) {
            mkdir(dirname($this->path), 0775, true);
        }

        if (!file_exists($this->path)) {
            file_put_contents($this->path, '{}');
        }
    }

    public function increment(int $contactLinkId): void
    {
        $bufferFile = fopen($this->path, 'c+');
        flock($bufferFile, LOCK_EX);

        $size = filesize($this->path);
        $contents = $size > 0 ? fread($bufferFile, $size) : '{}';
        $bufferedClicks = json_decode($contents, true) ?: [];

        $bufferedClicks[$contactLinkId] = ($bufferedClicks[$contactLinkId] ?? 0) + 1;

        ftruncate($bufferFile, 0);
        rewind($bufferFile);
        fwrite($bufferFile, json_encode($bufferedClicks));

        flock($bufferFile, LOCK_UN);
        fclose($bufferFile);
    }

    public function flushAndReset(): array
    {
        $bufferFile = fopen($this->path, 'c+');
        flock($bufferFile, LOCK_EX);

        $size = filesize($this->path);
        $contents = $size > 0 ? fread($bufferFile, $size) : '{}';
        $bufferedClicks = json_decode($contents, true) ?: [];

        ftruncate($bufferFile, 0);
        rewind($bufferFile);
        fwrite($bufferFile, '{}');

        flock($bufferFile, LOCK_UN);
        fclose($bufferFile);

        return $bufferedClicks;
    }
}
