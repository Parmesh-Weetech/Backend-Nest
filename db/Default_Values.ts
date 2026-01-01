export const ROLES = [
    {
        key: 'admin',
        label: 'Admin',
        description: 'Full system access',
    },
    {
        key: 'user',
        label: 'User',
        description: 'Standard user access',
    },
];

export const PERMISSIONS = [
    {
        key: 'user.create',
        label: 'Create User',
        entity: 'user',
        action: 'create',
        roles: ['admin'],
    },
    {
        key: 'user.update',
        label: 'Update User',
        entity: 'user',
        action: 'update',
        roles: ['admin'],
    },
    {
        key: 'user.delete',
        label: 'Delete User',
        entity: 'user',
        action: 'delete',
        roles: ['admin'],
    },
    {
        key: 'user.read.self',
        label: 'Read Own Profile',
        entity: 'user',
        action: 'read',
        roles: ['user'],
    },
    {
        key: 'user.update.self',
        label: 'Update Own Profile',
        entity: 'user',
        action: 'update',
        roles: ['user'],
    }
]
