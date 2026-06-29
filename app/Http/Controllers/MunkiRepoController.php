<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MunkiRepoController extends Controller
{
    public function index(): Response
    {
        $repoPath = realpath($this->repoPath());
        abort_if($repoPath === false, 404);

        return response($this->directoryIndex($repoPath), 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }

    public function show(string $path): Response|BinaryFileResponse
    {
        $repoPath = realpath($this->repoPath());
        abort_if($repoPath === false, 404);

        $filePath = realpath($repoPath.'/'.ltrim($path, '/'));
        abort_if(
            $filePath === false
                || ! str_starts_with($filePath, $repoPath.DIRECTORY_SEPARATOR)
                || (! File::isFile($filePath) && ! File::isDirectory($filePath)),
            404,
        );

        if (File::isDirectory($filePath)) {
            return response($this->directoryIndex($filePath, trim($path, '/')), 200, [
                'Content-Type' => 'text/html; charset=UTF-8',
            ]);
        }

        return response()->file($filePath);
    }

    private function directoryIndex(string $path, string $relativePath = ''): string
    {
        $directories = collect(File::directories($path))
            ->map(fn (string $directory) => [
                'name' => basename($directory).'/',
                'path' => $this->repoHref(trim($relativePath.'/'.basename($directory), '/')),
            ])
            ->sortBy('name')
            ->values()
            ->all();
        $files = collect(File::files($path))
            ->map(fn (\SplFileInfo $file) => [
                'name' => $file->getFilename(),
                'path' => $this->repoHref(trim($relativePath.'/'.$file->getFilename(), '/')),
            ])
            ->sortBy('name')
            ->values()
            ->all();
        $parent = $relativePath !== ''
            ? '<li><a href="'.$this->repoHref(dirname($relativePath) === '.' ? '' : dirname($relativePath)).'">../</a></li>'
            : '';
        $items = collect([...$directories, ...$files])
            ->map(fn (array $item) => '<li><a href="'.$item['path'].'">'.e($item['name']).'</a></li>')
            ->implode(PHP_EOL);
        $title = 'Munkitop repository'.($relativePath !== '' ? ' / '.e($relativePath) : '');

        return implode(PHP_EOL, [
            '<!doctype html>',
            '<html lang="en">',
            '<head>',
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            '<title>'.$title.'</title>',
            '<style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:2rem;line-height:1.5;color:#111827;background:#f9fafb}main{max-width:760px;margin:auto;background:white;border:1px solid #e5e7eb;border-radius:18px;padding:24px;box-shadow:0 18px 50px rgba(15,23,42,.08)}h1{margin-top:0;font-size:1.5rem}ul{padding-left:1.2rem}li{margin:.35rem 0}a{color:#2563eb;font-weight:650;text-decoration:none}a:hover{text-decoration:underline}.muted{color:#6b7280}</style>',
            '</head>',
            '<body>',
            '<main>',
            '<p class="muted">Munki repository</p>',
            '<h1>'.$title.'</h1>',
            '<ul>',
            $parent,
            $items !== '' ? $items : '<li class="muted">Empty directory</li>',
            '</ul>',
            '</main>',
            '</body>',
            '</html>',
        ]);
    }

    private function repoHref(string $path): string
    {
        if ($path === '') {
            return '/repo';
        }

        return '/repo/'.collect(explode('/', $path))
            ->map(fn (string $segment) => rawurlencode($segment))
            ->implode('/');
    }
}
