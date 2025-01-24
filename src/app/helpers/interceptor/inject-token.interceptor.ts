import { HttpInterceptorFn } from '@angular/common/http';

export const injectTokenInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
