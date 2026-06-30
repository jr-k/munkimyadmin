import { PageProps, PermissionAction, PermissionResource } from './types';

export function can(props: PageProps, resource: PermissionResource | 'export' | 'users' | 'store', action?: PermissionAction | 'manage') {
    const permissions = props.auth?.permissions ?? [];

    if (props.auth?.isAdmin) {
        return true;
    }

    if (resource === 'export') {
        return permissions.includes('export');
    }

    if (resource === 'users') {
        return permissions.includes('users.manage');
    }

    if (resource === 'store') {
        return action === 'read' && permissions.includes('store.read');
    }

    if (!action) {
        return false;
    }

    if (action === 'read' && permissions.includes(`${resource}.update`)) {
        return true;
    }

    return permissions.includes(`${resource}.${action}`);
}
