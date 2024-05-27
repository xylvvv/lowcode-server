export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export enum PermissionSubject {
  USER = 'User',
  RESOURCE = 'Resource',
  ROLE = 'Role',
  WORK = 'Work',
  LIBRARY = 'Library',
}
