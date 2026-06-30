import { Link, router, usePage } from '@inertiajs/react';
import { type ChangeEvent } from 'react';
import { useI18n } from '../../i18n';
import { PageProps } from '../../types';
import * as S from './styled';

type StoreHeaderProps = {
    storeName: string;
    subtitle: string;
    mainColor: string;
};

export default function StoreHeader({ storeName, subtitle, mainColor }: StoreHeaderProps) {
    const { props } = usePage<PageProps>();
    const { locale, setLocale, t } = useI18n();
    const storeInitial = storeName.trim().slice(0, 1).toUpperCase() || 'S';
    const canOpenAdmin = !props.auth.isStoreOnly && (props.auth.isAdmin || props.auth.permissions.length > 0);

    return (
        <S.Header>
            <S.Brand>
                <S.BrandMark $mainColor={mainColor}>
                    {props.app.public_store.logo_url ? (
                        <S.BrandLogo alt="" src={props.app.public_store.logo_url} />
                    ) : storeInitial}
                </S.BrandMark>
                <div>
                    <S.Title>{storeName}</S.Title>
                    <S.Subtitle>{subtitle}</S.Subtitle>
                </div>
            </S.Brand>
            <S.HeaderActions>
                <S.LanguageSelectWrapper>
                    <S.LanguageSelect
                        value={locale}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => setLocale(event.target.value as 'en' | 'fr')}
                        aria-label={t('layout.language')}
                    >
                        <option value="en">🇬🇧 EN</option>
                        <option value="fr">🇫🇷 FR</option>
                    </S.LanguageSelect>
                </S.LanguageSelectWrapper>
                {canOpenAdmin ? (
                    <S.AdminLink as={Link} href="/">
                        {t('store.openAdmin')}
                    </S.AdminLink>
                ) : null}
                <S.LogoutButton type="button" onClick={() => router.post('/logout')}>
                    {t('layout.logout')}
                </S.LogoutButton>
            </S.HeaderActions>
        </S.Header>
    );
}
