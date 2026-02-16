export const ROLES = [
    {
        key: 'admin',
        label: 'Admin',
        description: 'Full system access',
    },
];

export const PERMISSIONS = [
    {
        key: 'admin',
        label: 'Admin',
        entity: 'organization',
        action: 'all',
        roles: ['admin'],
        description: 'Admin can do everything in organization.'
    },
    {
        key: 'admin',
        label: 'Admin',
        entity: 'user',
        action: 'all',
        roles: ['admin'],
        description: 'Admin can do everything in user.'
    },
    {
        key: 'admin',
        label: 'Admin',
        entity: 'post',
        action: 'all',
        roles: ['admin'],
        description: 'Admin can do everything in post.'
    },
    {
        key: 'admin',
        label: 'Admin',
        entity: 'role',
        action: 'all',
        roles: ['admin'],
        description: 'Admin can do everything in role.'
    },
    {
        key: 'admin',
        label: 'Admin',
        entity: 'permission',
        action: 'all',
        roles: ['admin'],
        description: 'Admin can do everything in permission.'
    },
    {
        key: 'admin',
        label: 'Admin',
        entity: 'product',
        action: 'all',
        roles: ['admin'],
        description: 'Admin can do everything in product.'
    },
]
