import { I18nObject } from "./I18nObject"

export interface EquipmentType{
    id: string,
    names: I18nObject[],
    icon_name: string,
    color: string,
    isBattery: boolean,
    isCharging: boolean,
    equipmentTypeDurationParams: EquipmentTypeDurationParams,
}

export interface EquipmentTypeLocale{
    id: string,
    name: string,
    icon_name: string,
    color: string,
    isBattery: boolean,
    isCharging: boolean,
    equipmentTypeDurationParams: EquipmentTypeDurationParams
}

export interface EquipmentTypeDurationParams{
    isDurationEditable: boolean,
    isDurationLengthEditable: boolean,
    originalDuration: string,
    step: string,
    minDuration: string,
    maxDuration: string
}
