import { Head, useForm, usePage } from '@inertiajs/react';
import FlashMessage from '../../Components/FlashMessage';
import FormField from '../../Components/FormField';
import LogoMark from '../../Components/LogoMark';
import { useI18n } from '../../i18n';
import { PageProps } from '../../types';
import AuthLanguageSelect from '../Login/AuthLanguageSelect';
import * as S from '../Login/styled';

export default function ForgotPassword() {
    const { t } = useI18n();
    const { props } = usePage<PageProps>();
    const displayName = props.app.display_name;
    const mainColor = props.app.main_color;
    const logoUrl = props.app.logo_url;
    const form = useForm({
        email: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/forgot-password', {
            preserveScroll: true,
        });
    }

    return (
        <S.LoginContainer>
            <Head title={t('forgotPassword.title')} />
            <AuthLanguageSelect />
            <S.Panel onSubmit={submit}>
                <S.Brand>
                    <LogoMark size={42} color={mainColor} logoUrl={logoUrl} />
                    <S.Title>{displayName}</S.Title>
                </S.Brand>
                <S.Help>{t('forgotPassword.help')}</S.Help>
                <FlashMessage message={props.flash.success} tone="success" />
                <FlashMessage message={props.flash.error} tone="error" />
                <FormField label="Email" error={form.errors.email}>
                    <S.Input
                        type="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                    />
                </FormField>
                <S.Button type="submit" disabled={form.processing} $mainColor={mainColor}>
                    {form.processing ? t('forgotPassword.sending') : t('forgotPassword.submit')}
                </S.Button>
                <S.LinkRow>
                    <S.TextLink href="/login" $mainColor={mainColor}>{t('forgotPassword.backToLogin')}</S.TextLink>
                </S.LinkRow>
            </S.Panel>
        </S.LoginContainer>
    );
}
