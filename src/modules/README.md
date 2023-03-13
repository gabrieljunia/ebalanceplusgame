# Modules directory
This directory contains the modules used in the project.

## Directory structure
```
src
└── modules
    ├── i18n.ts
    ├── pinia.ts
    └── router.ts
```

## Modules
### `i18n`
Module to handle the internationalization of the project.
The different languages are stored in the `locales` directory and then imported in the `i18n` module in an object called `messages`.  
The created `i18n` instance is then exported and used in the `main.ts` file to initialize the `vue-i18n` plugin.

### `pinia`
Module to handle the state management of the project.

### `router`
Module to handle the routing of the project.  
The different routes are stored in a `routes` object and then imported in the `router` module.

To add a new route, add the following code to the `routes` object in the `router` module:
```ts
{ path: '/new-route', name: 'NewRoute', component: () => import('../views/NewRoute.vue') }
```

