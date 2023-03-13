# Locales directory
This directory contains the translation files for the project.

## Directory structure
```
src
└── locales
    ├── en.json
    ├── fr.json
    └── locale.json
```
The `locale.json` file contains the list of available languages, and their corresponding flag. It is used by the `TheLanguageSelector` component to allow users to choose their desired display language.

## Adding a new language
To add a new language : 
1. Create a new file in the `locales` directory, with the language code as the file name. For example, to add a new language `es`, create a file named `es.json`.
2. Copy the content of the `en.json` file into the new file. Replace the English text on the right with the corresponding translation.
3. Add the language code and the corresponding flag to the `locale.json` file. For example, to add the `es` language, add the following code to the `locale.json` file:
```json
{
  "lang": "es",
  "icon": "flag:es-4x3"
}
```
We use the flag icons in a 4*3 version from the [Flag-icons](https://icon-sets.iconify.design/flag) icon set. You can find the list of available flags [here](https://icon-sets.iconify.design/flag).

4. Add the new language to the `i18n` module in the `src\modules\i18n.ts` file. For example, to add the `es` language, add the following code to the `src\modules\i18n.ts` file:

```ts
import es from '../locales/es.json'
const messages = {
  fr:fr,
  en:en,
  es:es
}
```
5. Don't forget to add translations for all the objects in the `src\data` directory. You'll find properties with arrays of objects like so :
```json
"propertyName":[
  {"lang":"fr","text":"Name in french"},
  {"lang":"en","text":"Name in english"}
],
```
You'll need to add a new object to the array for the new language. For example, to add the `es` language, add the following code to the `propertyName` array:
```json
{"lang":"es","text":"Name in spanish"}
```
