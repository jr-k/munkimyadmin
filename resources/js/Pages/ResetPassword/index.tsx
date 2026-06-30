import { Head, useForm, usePage } from '@inertiajs/react';
import FlashMessage from '../../Components/FlashMessage';
import FormField from '../../Components/FormField';
import LogoMark from '../../Components/LogoMark';
import { useI18n } from '../../i18n';
import { PageProps } from '../../types';
import AuthLanguageSelect from '../Login/AuthLanguageSelect';
import * as S from '../Login/styled';

type ResetPasswordProps = PageProps & {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useI18n();
    const { props } = usePage<PageProps>();
    const displayName = props.app.display_name;
    const mainColor = props.app.main_color;
    const logoUrl = props.app.logo_url;
    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/reset-password');
    }

    return (
        <S.LoginContainer>
            <Head title={t('resetPassword.title')} />
            <AuthLanguageSelect />
            <S.Panel onSubmit={submit}>
                <S.Brand>
                    <LogoMark size={42} color={mainColor} logoUrl={logoUrl} />
                    <S.Title>{displayName}</S.Title>
                </S.Brand>
                <S.Help>{t('resetPassword.help')}</S.Help>
                <FlashMessage message={props.flash.success} tone="success" />
                <FlashMessage message={props.flash.error} tone="error" />
                <FormField label="Email" error={form.errors.email}>
                    <S.Input
                        type="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                    />
                </FormField>
                <FormField label={t('login.password')} error={form.errors.password}>
                    <S.Input
                        type="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                </FormField>
                <FormField label={t('resetPassword.passwordConfirmation')} error={form.errors.password_confirmation}>
                    <S.Input
                        type="password"
                        value={form.data.password_confirmation}
                        onChange={(event) => form.setData('password_confirmation', event.target.value)}
                    />
                </FormField>
                <S.Button type="submit" disabled={form.processing} $mainColor={mainColor}>
                    {form.processing ? t('resetPassword.saving') : t('resetPassword.submit')}
                </S.Button>
            </S.Panel>
        </S.LoginContainer>
    );
}
