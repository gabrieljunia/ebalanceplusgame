import { EquipmentType, EquipmentTypeLocale } from './EquipmentType';

export interface Equipment{
    id: string,
    energy_class: string,
    type: EquipmentType,
    equipmentCostParams: EquipmentCostParams,
    equipmentConsumptionParams: EquipmentConsumptionParams
}

export interface EquipmentLocale{
    id: string,
    type: EquipmentTypeLocale,
    energy_class: string,
    equipmentCostParams: EquipmentCostParams,
    equipmentConsumptionParams: EquipmentConsumptionParams
}

export interface EquipmentCostParams{
    originalPrice: number,
    hasCost: boolean,
    isCostEditable: boolean,
    step: number,
    minCost: number,
    maxCost: number
}

export interface EquipmentConsumptionParams{
    originalConsumption: number,
    isConsumptionEditable: boolean,
    step: number,
    minConsumption: number,
    maxConsumption: number
}
