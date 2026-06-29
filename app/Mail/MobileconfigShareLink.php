<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class MobileconfigShareLink extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $url,
        public readonly ?string $targetName,
        public readonly ?Carbon $expiresAt,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre profil de configuration Munki',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.mobileconfig-share-link',
            text: 'mail.mobileconfig-share-link-text',
        );
    }
}
