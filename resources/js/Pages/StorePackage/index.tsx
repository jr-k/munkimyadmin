import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '../../Components/ConfirmModal';
import FlashMessage from '../../Components/FlashMessage';
import PackageIcon from '../../Components/PackageIcon';
import { TranslationKey, useI18n } from '../../i18n';
import { PageProps } from '../../types';
import StoreHeader from '../Store/StoreHeader';
import * as S from './styled';

type StorePackage = {
    id: number;
    munki_name: string;
    display_name: string;
    category: string | null;
    description: string | null;
    bundle_identifier: string | null;
    version: string | null;
    icon_url: string | null;
    store_url: string;
    availability: 'install' | 'uninstall' | 'on_demand' | 'optional_install' | null;
    on_public_store: boolean;
    can_toggle: boolean;
};

type StorePackageProps = PageProps & {
    person: {
        id: number | null;
        name: string;
        email: string;
    };
    package: StorePackage;
    manifest_available: boolean;
};

export default function StorePackage({ person, package: pkg, manifest_available }: StorePackageProps) {
    const { props } = usePage<StorePackageProps>();
    const { t } = useI18n();
    const [pendingInstalled, setPendingInstalled] = useState<boolean | null>(null);
    const storeName = props.app.public_store.name || t('store.title');
    const mainColor = props.app.public_store.main_color;
    const installed = pkg.availability === 'install' || pkg.availability === 'optional_install';
    const hasFlashMessage = Boolean(props.flash.success || props.flash.error);
    const categoryLabel = packageCategoryLabel(pkg.category, t) ?? pkg.category;
    const subtitle = person.name
        ? t('store.subtitleWithEmail', { name: person.name, email: person.email })
        : t('store.subtitle', { name: person.email });
    const packageMeta = [
        pkg.version ? t('store.versionMeta', { version: pkg.version }) : null,
        pkg.bundle_identifier,
    ].filter(Boolean).join(' · ');
    const activationHelp = pkg.can_toggle ? t('store.packageToggleHelp') : lockedHint(pkg.availability, t);

    function confirmToggle() {
        if (pendingInstalled === null) {
            return;
        }

        router.put(`/store/packages/${pkg.id}/choice`, {
            installed: pendingInstalled,
        }, {
            preserveScroll: true,
            onFinish: () => setPendingInstalled(null),
        });
    }

    return (
        <S.Page $mainColor={mainColor}>
            <Head title={`${pkg.display_name} · ${storeName}`} />
            {hasFlashMessage ? (
                <S.FlashMessages>
                    <FlashMessage tone="success" message={props.flash.success} />
                    <FlashMessage tone="error" message={props.flash.error} />
                </S.FlashMessages>
            ) : null}
            {!manifest_available ? (
                <S.ManifestNotice>{t('store.manifestMissing')}</S.ManifestNotice>
            ) : null}

            <StoreHeader storeName={storeName} subtitle={subtitle} mainColor={mainColor} />

            <S.PackageContent>
                <S.ContentBackLink as={Link} href="/store/public" aria-label={t('store.backToStore')}>
                    <span aria-hidden="true">←</span>
                    {t('store.backToStore')}
                </S.ContentBackLink>

                <S.PackagePanel>
                    <S.PackageHero>
                        <S.PackageIconWrap>
                            <PackageIcon iconUrl={pkg.icon_url} name={pkg.display_name} size="md" />
                        </S.PackageIconWrap>
                        <S.PackageIntro>
                            <S.PackageTopRow>
                                {categoryLabel ? <S.PackageEyebrow>{categoryLabel}</S.PackageEyebrow> : <span />}
                                <S.AvailabilityBadge $availability={pkg.availability}>
                                    {availabilityLabel(pkg.availability, t)}
                                </S.AvailabilityBadge>
                            </S.PackageTopRow>
                            <S.PackageTitle>{pkg.display_name}</S.PackageTitle>
                            {packageMeta ? <S.PackageMeta>{packageMeta}</S.PackageMeta> : null}
                            {pkg.description ? <S.Description>{pkg.description}</S.Description> : null}
                        </S.PackageIntro>
                    </S.PackageHero>

                    <S.ActivationCard>
                        <div>
                            <S.ActivationTitle>{installed ? t('store.packageInstalled') : t('store.packageNotInstalled')}</S.ActivationTitle>
                            <S.ActivationText>{activationHelp}</S.ActivationText>
                        </div>
                        <S.ActivationButton
                            type="button"
                            disabled={!pkg.can_toggle}
                            $tone={installed ? 'danger' : 'success'}
                            onClick={() => setPendingInstalled(!installed)}
                        >
                            {installed ? t('store.uninstallConfirm') : t('store.installConfirm')}
                        </S.ActivationButton>
                    </S.ActivationCard>
                </S.PackagePanel>
            </S.PackageContent>

            <ConfirmModal
                open={pendingInstalled !== null}
                title={pendingInstalled ? t('store.installConfirmTitle') : t('store.uninstallConfirmTitle')}
                description={t(pendingInstalled ? 'store.installConfirmDescription' : 'store.uninstallConfirmDescription', {
                    name: pkg.display_name,
                })}
                confirmLabel={pendingInstalled ? t('store.installConfirm') : t('store.uninstallConfirm')}
                tone={pendingInstalled ? 'success' : 'danger'}
                onClose={() => setPendingInstalled(null)}
                onConfirm={confirmToggle}
            />
        </S.Page>
    );
}

function availabilityLabel(availability: StorePackage['availability'], t: (key: TranslationKey) => string) {
    if (availability === 'install') {
        return t('store.forcedInstall');
    }

    if (availability === 'uninstall') {
        return t('store.forcedUninstall');
    }

    if (availability === 'optional_install') {
        return t('store.optionalInstalled');
    }

    return t('store.availableOnDemand');
}

function lockedHint(availability: StorePackage['availability'], t: (key: TranslationKey) => string) {
    if (availability === 'uninstall') {
        return t('store.lockedUninstallHint');
    }

    return t('store.lockedHint');
}

function packageCategoryLabel(category: string | null, t: (key: TranslationKey) => string) {
    if (!category) {
        return null;
    }

    return t(`packages.category.${category}` as TranslationKey);
}
