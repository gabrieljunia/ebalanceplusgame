export interface EquipmentType{
    id: string,
    names: EquipmentTypeName[],
    icon_name: string,
    color: string,
    isBattery: boolean,
    equipmentTypeDurationParams: EquipmentTypeDurationParams,
}

export interface EquipmentTypeLocale{
    id: string,
    name: string,
    icon_name: string,
    color: string,
    isBattery: boolean,
    equipmentTypeDurationParams: EquipmentTypeDurationParams
}

export interface EquipmentTypeName{
    lang: string,
    name: string
}

export interface EquipmentTypeDurationParams{
    isDurationEditable: boolean,
    isDurationLengthEditable: boolean,
    originalDuration: string,
    step: string,
    minDuration: string,
    maxDuration: string
}
