import 'zone.js';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {bootstrapApplication} from "@angular/platform-browser";


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    HttpClientModule,
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ],
}).catch(err => console.error(err));

