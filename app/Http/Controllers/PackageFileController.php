<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class PackageFileController extends Controller
{
    public function __invoke(Request $request, Package $package): Response
    {
        abort_if(! $package->pkg_path, 404);

        $path = Storage::disk('local')->path($package->pkg_path);

        abort_if(! File::isFile($path), 404);

        if (config('munki.package_x_accel')) {
            return response('', 200, $this->headers($package, $path, $request->boolean('download')) + [
                'X-Accel-Redirect' => $this->xAccelPath($package->pkg_path),
            ]);
        }

        if ($request->boolean('download')) {
            return response()->download($path, basename($package->pkg_path), $this->headers($package, $path, true));
        }

        return response()->file($path, $this->headers($package, $path, false));
    }

    private function headers(Package $package, string $path, bool $download): array
    {
        $fileName = basename($package->pkg_path ?? $path);
        $disposition = $download ? 'attachment' : 'inline';

        return [
            'Accept-Ranges' => 'bytes',
            'Content-Disposition' => $disposition.'; filename="'.$this->asciiFileName($fileName).'"',
            'Content-Length' => (string) File::size($path),
            'Content-Type' => File::mimeType($path) ?: 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
        ];
    }

    private function asciiFileName(string $fileName): string
    {
        return str_replace('"', '', $fileName);
    }

    private function xAccelPath(string $path): string
    {
        return '/__private_packages/'.str_replace('%2F', '/', rawurlencode($path));
    }
}
