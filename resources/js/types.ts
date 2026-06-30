import type { TranslationKey } from './i18n';

export type FlashMessagePayload =
    | string
    | {
        key: TranslationKey;
        params?: Record<string, string | number>;
    };

export type Group = {
    id: number;
    name: string;
    slug: string;
    notes: string | null;
    is_system: boolean;
    manifest?: ManifestPreview;
    people_count?: number;
    people?: Person[];
};

export type Person = {
    id: number;
    name: string;
    first_name: string | null;
    email: string;
    client_identifier: string;
    notes: string | null;
    public_store_access: boolean;
    groups: Group[];
    manifest: ManifestPreview;
    store_user: {
        id: number;
        email: string;
        is_store_account: boolean;
        store_account_enabled: boolean;
    } | null;
};

export type Package = {
    id: number;
    munki_name: string;
    display_name: string;
    category: string | null;
    description: string | null;
    bundle_identifier: string | null;
    version: string | null;
    icon_path: string | null;
    icon_url: string | null;
    store_url: string;
    pkg_path: string | null;
    pkg_file_url: string | null;
    hash: string;
    pkg_url: string | null;
    active: boolean;
    on_public_store: boolean;
    assignments_count?: number;
    assignments?: PackageAssignment[];
};

export type AssignmentAction = 'install' | 'uninstall' | 'on_demand' | 'optional_install';

export type PackageAssignment = {
    id: number;
    action: AssignmentAction;
    target: {
        id: number | null;
        type: 'person' | 'group';
        name: string | null;
        identifier: string | null;
    };
};

export type Assignment = {
    id: number;
    action: AssignmentAction;
    package: {
        id: number | null;
        name: string | null;
        munki_name: string | null;
        icon_url: string | null;
    };
    target: {
        id: number | null;
        type: 'person' | 'group';
        name: string | null;
        identifier: string | null;
    };
};

export type ManifestPreview = {
    path: string;
    url: string;
    content: string | null;
};

export type MobileconfigShare = {
    id: number;
    ulid: string;
    url: string;
    target: {
        type: 'person' | 'group' | 'missing';
        id: number | null;
        name: string | null;
        identifier: string | null;
        email?: string | null;
    };
    expires_at: string | null;
    expired: boolean;
    created_at: string | null;
};

export type UserRole = 'owner' | 'admin' | 'user';

export type PermissionResource = 'people' | 'groups' | 'links' | 'packages' | 'assignments';

export type PermissionAction = 'read' | 'update';

export type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_owner: boolean;
    person_id: number | null;
    is_store_account: boolean;
    store_account_enabled: boolean;
    person: {
        id: number;
        name: string;
        email: string;
    } | null;
    permissions: string[];
    created_at: string | null;
    last_login_at: string | null;
};

export type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: UserRole;
            is_owner: boolean;
            person_id: number | null;
            is_store_account: boolean;
            store_account_enabled: boolean;
        } | null;
        permissions: string[];
        isAdmin: boolean;
        isOwner: boolean;
        canAccessStore: boolean;
        isStoreOnly: boolean;
    };
    app: {
        display_name: string;
        main_color: string;
        logo_url: string | null;
        preset_colors: string[];
        public_store: {
            name: string;
            main_color: string;
            logo_url: string | null;
            preset_colors: string[];
        };
        version: string;
        safe_mode: boolean;
    };
    flash: {
        success?: FlashMessagePayload;
        error?: FlashMessagePayload;
    };
};
