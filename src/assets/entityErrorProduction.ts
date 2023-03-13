import { I18nObject } from "../types/I18nObject";
import { ProductionCurve } from "../types/Production";
import { errorI18nObject } from "./entityErrorI18nObject";

export const errorProductionCurve = {
    id: '0',
    names: [errorI18nObject] as I18nObject[],
    descriptions: [errorI18nObject] as I18nObject[],
    svg: '',
    solar: [],
    wind: [],
    hydro: [],
    total: []
} as ProductionCurve;
