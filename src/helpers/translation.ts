import { I18nObject } from '../types/I18nObject';

export function convertI18nObjectToLocale(i18nObjects: I18nObject[], locale: string) {
    for(const text of i18nObjects) {
        if(text.lang === locale)
            return text.text;
    }
    return i18nObjects[0].text;
}
