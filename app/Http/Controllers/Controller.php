<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

abstract class Controller
{
    protected function manifestPreview(string $name): array
    {
        $relativePath = 'manifests/'.$name;
        $path = $this->repoPath().'/'.$relativePath;

        return [
            'path' => $relativePath,
            'url' => app(\App\Services\MunkiExternalUrl::class)->repoUrl().'/'.$relativePath,
            'content' => File::isFile($path) ? File::get($path) : null,
        ];
    }

    protected function repoPath(): string
    {
        $path = (string) config('munki.repo_path');

        return Str::startsWith($path, '/') ? $path : base_path($path);
    }

    protected function streamCsv(string $fileName, array $headers, iterable $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headers, $rows): void {
            $output = fopen('php://output', 'w');
            fputs($output, "\xEF\xBB\xBF");
            fputcsv($output, $headers);

            foreach ($rows as $row) {
                fputcsv($output, $row);
            }

            fclose($output);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
