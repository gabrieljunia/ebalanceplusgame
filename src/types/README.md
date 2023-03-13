# Types Directory
This directory contains all the types used in the project. The types being Typescript interface definitions for every objects and classes.  

## Directory structure
```
src
└── types
    ├── Board.ts
    ├── Consumption.ts
    ├── Energy.ts
    ├── Equipment.ts
    ├── EquipmentType.ts
    ├── I18nObject.ts
    ├── Money.ts
    ├── Multiplayer.ts
    ├── Production.ts
    ├── Results.ts
    └── Scenario.ts
```

## Add a new object type
If the object is used uniquely in another object, it should be defined in the same file as the object that uses it. For example, the `EquipmentCostParams` object is used only in the `Equipment` object, so the `EquipmentCostParams` object is defined in the `Equipment.ts` file.  

Otherwise, to add a new object type, create a new file in the `src/types` directory. The file name should be the name of the object type. For example, if the object type is `Equipment`, the file name should be `Equipment.ts`.  
