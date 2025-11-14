# TodoSharerApp

A collaborative todo list application built with Angular 20 featuring real-time synchronization, list sharing, and multi-language support.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Features

- ✅ Create and manage multiple todo lists
- ✅ Share lists with collaborators via email
- ✅ Real-time synchronization using Firebase
- ✅ Light/dark theme support
- ✅ Drag-and-drop task reordering
- ✅ Due date tracking with visual indicators
- ✅ Multi-language support (English, 繁體中文, 日本語)
- ✅ Server-Side Rendering (SSR) for improved performance

## Internationalization (i18n)

The application supports **runtime language switching** using **ngx-translate**:

- **English** (en)
- **Traditional Chinese** (zh-Hant) - 繁體中文
- **Japanese** (ja) - 日本語

Translation files are located in `src/assets/i18n/` and contain **34 translated strings** covering all UI components including sharing features.

### How it works

- Language is automatically detected from browser settings
- User selection is persisted in localStorage
- Instant switching via the globe icon in the navigation bar
- No page reload required

## Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
# or
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Project Structure

```
src/app/
├── services/          # Services (auth, list, todo, locale)
├── navigation/        # Top navigation bar component
├── login/            # Login page component
├── list-manager/     # List management component
├── todo-list/        # Main todo list component
├── todo-item/        # Individual todo item component
├── todo-controls/    # Todo list controls (search, sort, filter)
├── sharing-manager/  # List sharing component
└── assets/i18n/      # Translation files (en, zh-Hant, ja)
```

## Technology Stack

- **Angular 20** - Modern web framework
- **Firebase** - Authentication & Firestore database
- **Angular Material** - UI components
- **ngx-translate** - Runtime internationalization
- **Angular SSR** - Server-side rendering

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
