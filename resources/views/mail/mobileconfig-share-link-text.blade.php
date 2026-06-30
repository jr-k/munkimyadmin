{{ $appName }} - Configuration Munki

Votre profil de configuration Munki est prêt.

@if ($targetName)
Profil : {{ $targetName }}

@endif
Télécharger le profil :
{{ $url }}

@if ($expiresAt)
Ce lien expire le {{ $expiresAt->timezone(config('app.timezone'))->format('d/m/Y à H:i') }}.
@else
Ce lien n'a pas de date d'expiration.
@endif
