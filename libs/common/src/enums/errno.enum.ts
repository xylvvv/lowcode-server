export enum ERRNO_ENUM {
  USER_NOT_EXIST = 10001,
  PASSWORD_ERROR = 10002,
  USER_CREATE_FAILED = 10003,
  USER_FIND_FAILED = 10004,

  WORK_CREATE_FAILED = 11001,
  WORK_NOT_EXIST = 11002,
  WORK_FIND_FAILED = 11003,
  WORK_UPDATE_FAILED = 11004,
  WORK_FORCE_OFFLINE = 11005,
  WORK_DELETE_FAILED = 11006,
  WORK_DELETE_BACK_FAILED = 11007,
  AUTHOR_RECEIVER_SAME = 11008,
  WORK_TRANSFER_FAILED = 11009,
  WORK_AUTHOR_MISMATCHING = 11010,
  WORK_PUBLISH_FAILED = 11011,

  FILE_UPLOAD_FAILED = 19001,
  FILE_READ_FAILED = 19002,

  LIB_EXISTED = 12001,
  LIB_CREATE_FAILED = 12002,
  LIB_FIND_FAILED = 12003,
  LIB_VERSION_EXISTED = 12004,
  LIB_VERSIONS_FIND_FAILED = 12005,
  LIB_UPDATE_FAILED = 12006,
}
