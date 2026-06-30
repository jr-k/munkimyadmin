{{ $appName }} - Public Store

Votre accès au Store est prêt.

@if ($userName)
Bonjour {{ $userName }},
@else
Bonjour,
@endif

Un compte Store {{ $appName }} vient d'être créé pour vous. Choisissez votre mot de passe pour accéder aux logiciels mis à disposition par votre équipe.

Configurer mon compte :
{{ $setupUrl }}

Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
