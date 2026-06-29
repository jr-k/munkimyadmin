<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Profil de configuration Munki</title>
</head>
<body style="margin:0;background:#f6f8fb;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f8fb;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;box-shadow:0 18px 48px rgba(15,23,42,.08);overflow:hidden;">
                    <tr>
                        <td style="padding:32px 32px 18px;">
                            <div style="display:inline-block;background:#eff6ff;color:#2563eb;border-radius:999px;font-size:13px;font-weight:700;padding:8px 12px;">Munkitop</div>
                            <h1 style="font-size:28px;line-height:1.15;margin:22px 0 10px;color:#0f172a;">Votre profil Munki est prêt.</h1>
                            <p style="font-size:16px;line-height:1.65;margin:0;color:#475569;">
                                @if ($targetName)
                                    Le profil de configuration pour <strong>{{ $targetName }}</strong> peut être téléchargé depuis le lien ci-dessous.
                                @else
                                    Le profil de configuration peut être téléchargé depuis le lien ci-dessous.
                                @endif
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 32px 30px;">
                            <a href="{{ $url }}" style="display:block;background:#2563eb;border-radius:16px;color:#ffffff;font-size:16px;font-weight:800;padding:16px 18px;text-align:center;text-decoration:none;">Télécharger le profil</a>
                            <p style="font-size:13px;line-height:1.6;margin:18px 0 0;color:#64748b;">
                                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                            </p>
                            <p style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;color:#334155;font-size:13px;line-height:1.6;margin:8px 0 0;padding:12px;word-break:break-all;">{{ $url }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 32px;">
                            <p style="font-size:13px;line-height:1.6;margin:0;color:#64748b;">
                                @if ($expiresAt)
                                    Ce lien expire le {{ $expiresAt->timezone(config('app.timezone'))->format('d/m/Y à H:i') }}.
                                @else
                                    Ce lien n'a pas de date d'expiration.
                                @endif
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
