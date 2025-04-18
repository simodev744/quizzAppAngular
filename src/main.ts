import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Important pour HttpClient
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Pour les animations si besoin

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // withComponentInputBinding() est utile mais pas strictement nécessaire ici car on utilise snapshot/queryParams/state
    provideHttpClient(withInterceptorsFromDi()), // Fournir HttpClient globalement
    provideAnimationsAsync() // Fournir les animations (optionnel)
    // Si vous aviez des modules, vous importeriez `HttpClientModule` là-bas
  ]
}).catch(err => console.error(err));
