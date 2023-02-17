export interface EnergyStorageParameters {
    isEnergyStorage: boolean;
    initialStoredEnergy: number;
    numberOfBatteries: number;
    batteryIndividualCapacity: number;
    batteryPrice: number;
}

export interface EnergyMarketParameters {
    normalPrice: number,
    initialPricesList: number[],
}
