import { type ChangeEvent } from 'react';
import { useI18n } from '../../i18n';
import * as S from './styled';

export default function AuthLanguageSelect() {
    const { locale, setLocale, t } = useI18n();

    return (
        <S.AuthLanguageSelectWrapper>
            <S.AuthLanguageSelect
                value={locale}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setLocale(event.target.value as 'en' | 'fr')}
                aria-label={t('layout.language')}
            >
                <option value="en">🇬🇧 EN</option>
                <option value="fr">🇫🇷 FR</option>
            </S.AuthLanguageSelect>
        </S.AuthLanguageSelectWrapper>
    );
}
