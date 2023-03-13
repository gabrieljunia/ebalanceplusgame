import { EnergyStorageParameters } from '../types/Energy';

export const errorEnergyStorageParameters = {
    isEnergyStorage: false,
    initialStoredEnergy: 0,
    numberOfBatteries: 0,
    batteryPrice: 0,
    batteryIndividualCapacity: 0,
    batteryChargeEquipmentTypeId: 'battery_charge' as string,
    batteryDischargeEquipmentTypeId: 'battery_discharge' as string,
    batteryChargeLimitRate: 0,
    batteryDischargeLimitRate: 0,
    batteryChargeEfficiency: 0,
    batteryDischargeEfficiency: 0,
    batteryChargeLossRate: 0,
    batteryDischargeLossRate: 0
} as EnergyStorageParameters;
