import { EquipmentType, EquipmentTypeLocale, EquipmentTypeDurationParams } from "../types/EquipmentType"

const errorEquipmentTypeDurationParams = {
    isDurationEditable: false,
    isDurationLengthEditable: false,
    originalDuration: '00:15',
    step: '00:15',
    minDuration: '00:15',
    maxDuration: '23:45'
} as EquipmentTypeDurationParams;

export const errorEquipmentType = {
    id: 'error',
    names: [{lang: 'en', text: 'Error'}],
    icon_name: 'mdi:null',
    color: '#000000',
    isBattery: false,
    isCharging: false,
    equipmentTypeDurationParams: errorEquipmentTypeDurationParams
} as EquipmentType;

export const errorEquipmentTypeLocale = {
    id: 'error',
    name: 'Error',
    icon_name: 'mdi:null',
    color: '#000000',
    isBattery: false,
    isCharging: false,
    equipmentTypeDurationParams: errorEquipmentTypeDurationParams
} as EquipmentTypeLocale;
