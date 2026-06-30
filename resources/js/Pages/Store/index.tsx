import { Head, Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import FlashMessage from '../../Components/FlashMessage';
import PackageIcon from '../../Components/PackageIcon';
import { TranslationKey, useI18n } from '../../i18n';
import { PageProps } from '../../types';
import StoreHeader from './StoreHeader';
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

type StorePageProps = PageProps & {
    person: {
        id: number | null;
        name: string;
        email: string;
    };
    packages: StorePackage[];
    categories: string[];
    manifest_available: boolean;
};

export default function Store({ person, packages, categories, manifest_available }: StorePageProps) {
    const { props } = usePage<StorePageProps>();
    const { t } = useI18n();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const normalizedSearch = search.trim().toLowerCase();
    const storeName = props.app.public_store.name || t('store.title');
    const mainColor = props.app.public_store.main_color;
    const hasFlashMessage = Boolean(props.flash.success || props.flash.error);
    const subtitle = person.name
        ? t('store.subtitleWithEmail', { name: person.name, email: person.email })
        : t('store.subtitle', { name: person.email });

    const searchMatchedPackages = useMemo(() => packages.filter((pkg) => {
        const searchable = [
            pkg.display_name,
            pkg.munki_name,
            pkg.description ?? '',
            pkg.bundle_identifier ?? '',
            pkg.version ?? '',
            packageCategoryLabel(pkg.category, t) ?? '',
        ].join(' ').toLowerCase();

        return !normalizedSearch || searchable.includes(normalizedSearch);
    }), [normalizedSearch, packages, t]);

    const filteredPackages = useMemo(() => searchMatchedPackages.filter((pkg) => (
        category === 'all' || pkg.category === category
    )), [category, searchMatchedPackages]);

    const installedPackages = useMemo(() => filteredPackages.filter((pkg) => isInstalled(pkg.availability)), [filteredPackages]);
    const availablePackages = useMemo(() => filteredPackages.filter((pkg) => !isInstalled(pkg.availability)), [filteredPackages]);

    const categoryOptions = useMemo(() => categories.map((categoryName) => ({
        name: categoryName,
        label: packageCategoryLabel(categoryName, t) ?? categoryName,
        count: searchMatchedPackages.filter((pkg) => pkg.category === categoryName).length,
    })), [categories, searchMatchedPackages, t]);

    return (
        <S.Page $mainColor={mainColor}>
            <Head title={storeName} />
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

            <S.ContentLayout>
                <S.Sidebar aria-label={t('store.categories')}>
                    <S.SidebarSection>
                        <S.SidebarTitle>{t('store.categories')}</S.SidebarTitle>
                        <S.CategoryList>
                            <S.CategoryButton
                                type="button"
                                $active={category === 'all'}
                                $mainColor={mainColor}
                                onClick={() => setCategory('all')}
                            >
                                <span>{t('store.allCategories')}</span>
                                <S.CategoryCount>{searchMatchedPackages.length}</S.CategoryCount>
                            </S.CategoryButton>
                            {categoryOptions.map((categoryOption) => (
                                <S.CategoryButton
                                    key={categoryOption.name}
                                    type="button"
                                    $active={category === categoryOption.name}
                                    $mainColor={mainColor}
                                    onClick={() => setCategory(categoryOption.name)}
                                >
                                    <span>{categoryOption.label}</span>
                                    <S.CategoryCount>{categoryOption.count}</S.CategoryCount>
                                </S.CategoryButton>
                            ))}
                        </S.CategoryList>
                    </S.SidebarSection>
                </S.Sidebar>

                <S.MainContent>
                    <S.Filters>
                        <S.SearchInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('store.searchPlaceholder')}
                        />
                    </S.Filters>

                    <S.Section>
                        <S.SectionHeader>
                            <S.SectionTitle>{t('store.installedPackages')}</S.SectionTitle>
                            <S.ResultCount>{installedPackages.length}</S.ResultCount>
                        </S.SectionHeader>
                        {installedPackages.length === 0 ? (
                            <S.Empty>{t('store.noInstalledPackages')}</S.Empty>
                        ) : (
                            <S.CardList>
                                {installedPackages.map((pkg) => (
                                    <StoreCard
                                        key={pkg.id}
                                        pkg={pkg}
                                        mainColor={mainColor}
                                    />
                                ))}
                            </S.CardList>
                        )}
                    </S.Section>

                    <S.Section>
                        <S.SectionHeader>
                            <S.SectionTitle>{t('store.availablePackages')}</S.SectionTitle>
                            <S.ResultCount>{availablePackages.length}</S.ResultCount>
                        </S.SectionHeader>
                        {availablePackages.length === 0 ? (
                            <S.Empty>{t('store.noAvailablePackages')}</S.Empty>
                        ) : (
                            <S.CardList>
                                {availablePackages.map((pkg) => (
                                    <StoreCard
                                        key={pkg.id}
                                        pkg={pkg}
                                        mainColor={mainColor}
                                    />
                                ))}
                            </S.CardList>
                        )}
                    </S.Section>
                </S.MainContent>
            </S.ContentLayout>
        </S.Page>
    );
}

function StoreCard({
    pkg,
    mainColor,
}: {
    pkg: StorePackage;
    mainColor: string;
}) {
    const { t } = useI18n();
    const status = cardStatus(pkg.availability);
    const statusLabel = cardStatusLabel(pkg.availability, t);

    return (
        <S.Card as={Link} href={pkg.store_url} $mainColor={mainColor}>
            <S.IconWrap>
                <PackageIcon iconUrl={pkg.icon_url} name={pkg.display_name} size="card" />
            </S.IconWrap>
            <S.CardBody>
                <S.CardHeader>
                    <div>
                        <S.CardTitle>{pkg.display_name}</S.CardTitle>
                        <S.Meta>
                            {packageCategoryLabel(pkg.category, t) ?? pkg.category ?? pkg.munki_name}
                            {pkg.version ? ` · ${pkg.version}` : ''}
                        </S.Meta>
                    </div>
                </S.CardHeader>
            </S.CardBody>
            <S.CardStatus
                $status={status}
                aria-label={statusLabel}
                title={statusLabel}
            >
                {status === 'forced_install' || status === 'forced_uninstall' ? (
                    <Icon icon="mdi:lock" height={14} width={14} />
                ) : (status === 'installed' ? '✓' : '+')}
            </S.CardStatus>
        </S.Card>
    );
}

function packageCategoryLabel(category: string | null, t: (key: TranslationKey) => string) {
    if (!category) {
        return null;
    }

    return t(`packages.category.${category}` as TranslationKey);
}

function isInstalled(availability: StorePackage['availability']) {
    return availability === 'install' || availability === 'optional_install';
}

function cardStatus(availability: StorePackage['availability']) {
    if (availability === 'install') {
        return 'forced_install';
    }

    if (availability === 'uninstall') {
        return 'forced_uninstall';
    }

    if (availability === 'optional_install') {
        return 'installed';
    }

    return 'available';
}

function cardStatusLabel(availability: StorePackage['availability'], t: (key: TranslationKey) => string) {
    if (availability === 'install') {
        return t('store.forcedInstall');
    }

    if (availability === 'uninstall') {
        return t('store.forcedUninstall');
    }

    if (availability === 'optional_install') {
        return t('store.optionalInstalled');
    }

    return t('store.availableStatus');
}
