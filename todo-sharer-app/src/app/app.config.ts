import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "todo-sharder-angular-ssr", appId: "1:394518549753:web:6e79c0c2b83a4fb047be28", storageBucket: "todo-sharder-angular-ssr.firebasestorage.app", apiKey: "AIzaSyBFKBoJMGo9AJcy7trjUGPzXRfyFurKucw", authDomain: "todo-sharder-angular-ssr.firebaseapp.com", messagingSenderId: "394518549753", measurementId: "G-549WHRW7ZB" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
