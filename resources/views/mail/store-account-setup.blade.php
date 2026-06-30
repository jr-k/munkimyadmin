<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bienvenue sur le Store {{ $appName }}</title>
</head>
<body style="margin:0;background:#eef2f7;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none!important;max-height:0;max-width:0;opacity:0;overflow:hidden;">Votre compte Store {{ $appName }} est prêt. Choisissez votre mot de passe pour commencer.</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:36px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:26px;box-shadow:0 22px 58px rgba(15,23,42,.10);overflow:hidden;">
                    <tr>
                        <td style="background:#0f172a;padding:24px 28px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="vertical-align:middle;">
                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                            <tr>
                                                @if ($appLogoUrl)
                                                    <td style="background:{{ $appMainColor }};border-radius:14px;height:46px;overflow:hidden;width:46px;">
                                                        <img src="{{ $appLogoUrl }}" alt="" style="display:block;height:46px;object-fit:cover;width:46px;">
                                                    </td>
                                                @else
                                                    <td style="background:{{ $appMainColor }};border-radius:14px;color:#ffffff;font-size:22px;font-weight:900;height:46px;text-align:center;width:46px;">{{ strtoupper(substr($appName, 0, 1)) ?: 'M' }}</td>
                                                @endif
                                                <td style="padding-left:12px;">
                                                    <div style="color:#ffffff;font-size:20px;font-weight:900;line-height:1.1;">{{ $appName }}</div>
                                                    <div style="color:#cbd5e1;font-size:13px;line-height:1.4;">Public Store</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td align="right" style="vertical-align:middle;">
                                        <span style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);border-radius:999px;color:#dbeafe;display:inline-block;font-size:12px;font-weight:900;letter-spacing:.08em;padding:8px 11px;text-transform:uppercase;">Invitation</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);padding:32px 32px 20px;">
                            <h1 style="color:#0f172a;font-size:30px;line-height:1.12;margin:0 0 14px;">Votre accès au Store est prêt.</h1>
                            <p style="color:#475569;font-size:16px;line-height:1.65;margin:0;">
                                @if ($userName)
                                    Bonjour {{ $userName }},
                                @else
                                    Bonjour,
                                @endif
                                un compte Store {{ $appName }} vient d'être créé pour vous. Choisissez votre mot de passe pour accéder aux logiciels mis à disposition par votre équipe.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 32px 30px;">
                            <a href="{{ $setupUrl }}" style="background:{{ $appMainColor }};border-radius:14px;box-shadow:0 14px 28px rgba(37,99,235,.22);color:#ffffff;display:block;font-size:16px;font-weight:900;padding:16px 18px;text-align:center;text-decoration:none;">Configurer mon compte</a>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
                                <tr>
                                    <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:14px 16px;">
                                        <p style="color:#334155;font-size:14px;font-weight:800;line-height:1.45;margin:0 0 6px;">Lien sécurisé</p>
                                        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 10px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
                                        <p style="color:#1d4ed8;font-size:13px;line-height:1.6;margin:0;word-break:break-all;">{{ $setupUrl }}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 32px;">
                            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
