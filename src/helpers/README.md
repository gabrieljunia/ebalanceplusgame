# Helpers directory
This directory contains the helper functions used in the project.

## Directory structure
```
src
└── helpers
    ├── drawInPixels.ts
    ├── idGenerator.ts
    ├── listProcessor.ts
    ├── mqtt.ts
    ├── power.ts
    ├── time.ts
    └── translation.ts
```

## Helper functions
### `drawInPixels`
Contains functions to convert values be it watts or time to pixels.

### `idGenerator`
Generates a random id string.

### `listProcessor`
A helper function to process a list of items and get values : max, min, etc.

### `mqtt`
Contains functions to connect to the MQTT broker, subscribe to topics, publish messages, etc.

### `power`
Contains functions to convert watts to kilowatts, round off values, convert watts per 15 minutes to watts per hour, etc.

### `time`
All functions related to time are here.
- Convert times to strings and vice versa.
- Compare times.
- Add times.
- Subtract times.
- Convert times to indexes and vice versa.

### `translation`
Function to get the localized text from an I18nObject.
