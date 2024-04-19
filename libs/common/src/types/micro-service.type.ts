import { Observable } from 'rxjs';

// export type MicroServiceType<T> = {
//   [key in keyof T]: (
//     ...p: T[key] extends (...args) => any ? Parameters<T[key]> : any,
//   ) => T[key] extends (...args) => any
//     ? Observable<Awaited<ReturnType<T[key]>>>
//     : any;
// };

export type MicroServiceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R
    ? {
        [key in keyof R]: (
          ...p: R[key] extends (...args: any) => any ? Parameters<R[key]> : any
        ) => R[key] extends (...args) => any
          ? Observable<{
              errno: number;
              data: Awaited<ReturnType<R[key]>>;
              message?: string;
            }>
          : any;
      }
    : any;
