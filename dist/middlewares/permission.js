const roles = {
    owner: ['create', 'read', 'update', 'delete', 'download', 'upload'],
    admin: ['admin', 'create', 'read', 'update', 'delete', 'download', 'upload'],
    manager: ['create', 'read', 'update', 'delete', 'download', 'upload'],
    employee: ['create', 'read', 'update', 'download', 'upload'],
    staff: ['create', 'read', 'update', 'download', 'upload'],
    create_only: ['create', 'read', 'download', 'upload'],
    read_only: ['read', 'download'],
};
export const hasPermission = (permissionName = 'none') => {
    return (req, res, next) => {
        var _a;
        const currentUserRole = req.admin.role;
        if (((_a = roles[currentUserRole]) === null || _a === void 0 ? void 0 : _a.includes(permissionName)) ||
            currentUserRole === 'owner' ||
            currentUserRole === 'admin') {
            next();
        }
        else {
            return res.status(403).json({
                success: false,
                result: null,
                message: 'Access denied: you are not granted permission.',
            });
        }
    };
};
