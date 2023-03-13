import { I18nObject } from '../types/I18nObject';
import { Scenario, ScenarioLocale } from '../types/Scenario';
import { errorEnergyStorageParameters } from './entityErrorEnergyStorageParameters';
import { errorEquipmentType, errorEquipmentTypeLocale } from './entityErrorEquipmentType';
import { errorI18nObject } from './entityErrorI18nObject';
import { errorMoneyParameters } from './entityErrorMoneyParameters';
import { errorEnergyMarketParameters } from './entityErrorEnergyMarketParameters';

export const errorScenario = {
    id: '0',
    names: [errorI18nObject] as I18nObject[],
    days: [errorI18nObject] as I18nObject[],
    season: "Empty",
    icon: "mdi:null",
    color: "#000000", 
    descriptions: [errorI18nObject] as I18nObject[],
    equipment_types: [errorEquipmentType]
} as Scenario;

export const errorScenarioLocale = {
    id: '0',
    name: 'No scenario',
    day: '',
    season: '',
    icon: '',
    color: '',
    description: '',
    equipment_type_local: [errorEquipmentTypeLocale],
    initial_consumption: [],
    energyStorageParameters: errorEnergyStorageParameters,
    energyMarketParameters: errorEnergyMarketParameters,
    moneyParameters: errorMoneyParameters
} as ScenarioLocale;
