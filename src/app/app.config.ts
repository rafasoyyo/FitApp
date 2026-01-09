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
  apiKey: "AIzaSyDmISZtIh4TBnGJcI3VVrZOo5yAu--V6aI",
  authDomain: "fitcenterapp.firebaseapp.com",
  projectId: "fitcenterapp",
  storageBucket: "fitcenterapp.firebasestorage.app",
  messagingSenderId: "714839588094",
  appId: "1:714839588094:web:83a11951d7e3d1937839af",
  measurementId: "G-LR8BPBMBFM"
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
