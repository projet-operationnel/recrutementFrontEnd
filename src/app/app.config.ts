import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { captErrorInterceptor } from './helpers/interceptor/capt-error.interceptor';
import { injectTokenInterceptor } from './helpers/interceptor/inject-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(
      withInterceptors([captErrorInterceptor,injectTokenInterceptor])
    )
  ]
};
