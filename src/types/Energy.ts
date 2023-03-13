export interface EnergyStorageParameters {
    isEnergyStorage: boolean;
    initialStoredEnergy: number;
    numberOfBatteries: number;
    batteryPrice: number;
    batteryIndividualCapacity: number;
    batteryChargeEquipmentTypeId: string;
    batteryDischargeEquipmentTypeId: string;
    batteryChargeLimitRate: number;
    batteryDischargeLimitRate: number;
    batteryChargeEfficiency: number;
    batteryDischargeEfficiency: number;
    batteryChargeLossRate: number;
    batteryDischargeLossRate: number;
}


export interface EnergyMarketParameters {
    isEnergyMarket: boolean;
    salePricesList: number[],
    constantPrice: number
}
