# Stores Directory
This directory contains all the Pinia stores used in the project.

## Directory structure
```
src
└── stores
    ├── BoardStore.ts
    ├── ConsumptionStore.ts
    ├── EnergyStore.ts
    ├── EquipmentStore.ts
    ├── GameParametersStore.ts
    ├── MoneyStore.ts
    ├── MultiplayerStore.ts
    ├── ProductionStore.ts
    ├── ResultsStore.ts
    └── ScenarioStore.ts
```

## Pinia
The project uses [Pinia](https://pinia.vuejs.org/) for state management. Pinia is a lightweight state management library for Vue 3. It is inspired by Vuex and uses a similar API.  

## Stores
The stores are grouped by the domain they belong to. For example, the `BoardStore` contains the state related to the board. The `EquipmentStore` contains the state related to the equipments.  

### Store structure
Each store has the following structure:
```ts
export const useStore = defineStore({
    id: 'storeName',
    state: () => ({
        // state
    }),
    actions: {
        // actions
    },
    getters: {
        // getters
    }
});
```
The id is used by Pinia to connect the store to the devtools. Naming the returned function use... is a convention across composable to make its usage idiomatic.  

## Devtools
It is `highly recommended` to use the [vue-js-devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en) extension to debug the state of the application.  
It contains a Pinia tab which shows the state of the application in details and is an invaluable tool for debugging.  
