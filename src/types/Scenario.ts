import { EquipmentType, EquipmentTypeLocale } from './EquipmentType';
import { EnergyStorageParameters, EnergyMarketParameters} from './Energy';
import { Consumption } from './Consumption';
import { MoneyParameters } from './Money';

export interface Scenario{
    id: string,
    names: InternatObject[],
    days: InternatObject[],
    season: string,
    icon: string,
    color: string,
    descriptions: InternatObject[],
    equipment_types: EquipmentType[],
    initial_consumption: Consumption[],
    energyStorageParameters: EnergyStorageParameters,
    energyMarketParameters: EnergyMarketParameters,
    moneyParameters: MoneyParameters
}


export interface ScenarioLocale {
    id: string;
    name: string,
    day: string,
    season: string,
    icon: string,
    color: string,
    description: string,
    equipment_type_local: EquipmentTypeLocale[], 
    initial_consumption: Consumption[],
    energyStorageParameters: EnergyStorageParameters
    energyMarketParameters: EnergyMarketParameters,
    moneyParameters: MoneyParameters
}

export interface InternatObject{
    text: string,
    lang: string,
}
