import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Material from '@primeng/themes/material';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: 'fake-api-key',
  authDomain: 'fake-project.firebaseapp.com',
  projectId: 'fake-project',
  storageBucket: 'fake-project.firebasestorage.app',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:123456abcde',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    providePrimeNG({
        theme: {
            preset: Material,
            options: {
                darkModeSelector: '.my-app-dark'
            }
        }
    })
  ]
};
