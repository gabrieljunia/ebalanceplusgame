import { I18nObject } from "./I18nObject";

export interface ProductionCurve {
    id : string;
    names: I18nObject[];
    descriptions: I18nObject[];
    svg: string;
    solar: number[];
    wind: number[];
    hydro: number[];
    total: number[];
}
