import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '../../Components/AppLayout';
import FlashMessage from '../../Components/FlashMessage';
import FormField from '../../Components/FormField';
import { useI18n } from '../../i18n';
import { PageProps } from '../../types';
import * as S from '../StoreSettings/styled';

type AppSettingsPayload = {
    name: string;
    main_color: string;
    logo_url: string | null;
    preset_colors: string[];
};

type SettingsProps = PageProps & {
    settings: AppSettingsPayload;
};

type SettingsForm = {
    name: string;
    main_color: string;
    logo: File | null;
};

export default function Settings({ settings }: SettingsProps) {
    const { props } = usePage<SettingsProps>();
    const { t } = useI18n();
    const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo_url);
    const adminEmail = props.auth.user?.email ?? 'admin';
    const form = useForm<SettingsForm>({
        name: settings.name,
        main_color: settings.main_color,
        logo: null,
    });
    const appInitial = form.data.name.trim().slice(0, 1).toUpperCase() || 'M';

    useEffect(() => {
        if (!form.data.logo) {
            setLogoPreview(settings.logo_url);
            return;
        }

        const objectUrl = URL.createObjectURL(form.data.logo);
        setLogoPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.data.logo, settings.logo_url]);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/settings', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.setData('logo', null),
        });
    }

    return (
        <>
            <Head title={t('appSettings.title')} />
            <AppLayout adminEmail={adminEmail}>
                <FlashMessage tone="success" message={props.flash.success} />
                <FlashMessage tone="error" message={props.flash.error} />

                <S.PageHeader>
                    <div>
                        <S.Eyebrow>{t('layout.administrationSection')}</S.Eyebrow>
                        <S.Title>{t('appSettings.title')}</S.Title>
                        <S.Subtitle>{t('appSettings.subtitle')}</S.Subtitle>
                    </div>
                </S.PageHeader>

                <S.SettingsStack>
                    <S.PreviewPanel>
                        <S.PanelTitle>{t('store.preview')}</S.PanelTitle>
                        <S.PreviewCard $mainColor={form.data.main_color}>
                            <S.PreviewLogo $mainColor={form.data.main_color}>
                                {logoPreview ? <S.PreviewLogoImage alt="" src={logoPreview} /> : appInitial}
                            </S.PreviewLogo>
                            <S.PreviewText>
                                <S.PreviewTitle>{form.data.name || t('appSettings.defaultName')}</S.PreviewTitle>
                                <S.PreviewSubtitle>{t('appSettings.previewSubtitle')}</S.PreviewSubtitle>
                            </S.PreviewText>
                        </S.PreviewCard>
                    </S.PreviewPanel>

                    <S.Panel>
                        <S.PanelTitle>{t('store.identity')}</S.PanelTitle>
                        <S.Form onSubmit={submit}>
                            <FormField label={t('appSettings.nameLabel')} error={form.errors.name}>
                                <S.Input
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    placeholder={t('appSettings.defaultName')}
                                />
                            </FormField>

                            <FormField label={t('store.logoLabel')} error={form.errors.logo}>
                                <S.FileInput
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => form.setData('logo', event.target.files?.[0] ?? null)}
                                />
                            </FormField>

                            <FormField label={t('store.mainColorLabel')} error={form.errors.main_color}>
                                <S.ColorRow>
                                    <S.ColorPicker
                                        type="color"
                                        value={form.data.main_color}
                                        onChange={(event) => form.setData('main_color', event.target.value)}
                                        aria-label={t('store.mainColorLabel')}
                                    />
                                    <S.Input
                                        value={form.data.main_color}
                                        onChange={(event) => form.setData('main_color', event.target.value)}
                                        placeholder="#2563eb"
                                    />
                                </S.ColorRow>
                            </FormField>

                            <S.PresetList aria-label={t('store.presetColors')}>
                                {settings.preset_colors.map((color) => (
                                    <S.ColorSwatch
                                        key={color}
                                        type="button"
                                        $color={color}
                                        $active={form.data.main_color.toLowerCase() === color.toLowerCase()}
                                        onClick={() => form.setData('main_color', color)}
                                        aria-label={color}
                                    />
                                ))}
                            </S.PresetList>

                            <S.SaveButton type="submit" disabled={form.processing}>
                                {form.processing ? t('store.savingSettings') : t('store.saveSettings')}
                            </S.SaveButton>
                        </S.Form>
                    </S.Panel>
                </S.SettingsStack>
            </AppLayout>
        </>
    );
}
