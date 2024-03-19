import { Request, Response, NextFunction } from 'express';

interface Roles {
  [key: string]: string[];
}

const roles: Roles = {
  owner: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  admin: ['admin', 'create', 'read', 'update', 'delete', 'download', 'upload'],
  manager: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  employee: ['create', 'read', 'update', 'download', 'upload'],
  staff: ['create', 'read', 'update', 'download', 'upload'],
  create_only: ['create', 'read', 'download', 'upload'],
  read_only: ['read', 'download'],
};

export const hasPermission = (permissionName: string = 'none') => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    const currentUserRole = (req.admin as { role: string }).role;

    if (
      roles[currentUserRole]?.includes(permissionName) ||
      currentUserRole === 'owner' ||
      currentUserRole === 'admin'
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Access denied: you are not granted permission.',
      });
    }
  };
};
