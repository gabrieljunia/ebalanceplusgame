import { defineStore } from 'pinia';
import { Consumption } from '../types/Consumption';
import { EnergyStorageParameters } from '../types/Energy';

export const useEnergyStore = defineStore({
    id: 'EnergyStore',
    state: () => {
        return {
            energyStorageParameters: {
                isEnergyStorage: true as boolean,
                initialStoredEnergy: 0 as number,
                numberOfBatteries: 1 as number,
                batteryIndividualCapacity: 200 as number,
                batteryPrice: 50 as number
            } as EnergyStorageParameters,
            storedEnergy: 0 as number,
            maxEnergy: 200 as number,
            totalStoredEnergyOverTheGame: 0 as number,
            totalUSedEnergyOverTheGame: 0 as number,
            numberOfBatteries: 1 as number,
            energyPrice: 0 as number,
            clickedEnergyIcon: false as boolean,
            clickedStoreEnergy: false as boolean,
            clickedConsumeEnergy: false as boolean,
            storedEnergyList: [] as Consumption[],
            clickedMarketIcon: false as boolean, 
            clickedSaleMarket: false as boolean,
        };
    },
    actions: {
        initializeEnergyStore() {
            this.energyStorageParameters = useGameParametersStore().getScenarioEnergyStorageParameters;
            this.storedEnergy = 0 + this.energyStorageParameters.initialStoredEnergy;
            this.maxEnergy = 0 + this.energyStorageParameters.numberOfBatteries * this.energyStorageParameters.batteryIndividualCapacity;
            this.totalStoredEnergyOverTheGame = 0;
            this.totalUSedEnergyOverTheGame = 0;
        },
        addBattery() {
            if(useGameParametersStore().canWithdrawMoney(this.energyStorageParameters.batteryPrice)){
                this.numberOfBatteries++;
                this.maxEnergy += this.energyStorageParameters.batteryIndividualCapacity;
                useGameParametersStore().withdrawMoney(this.energyStorageParameters.batteryPrice);
            }
        },
        removeBattery() {
            if (this.numberOfBatteries > this.energyStorageParameters.numberOfBatteries) {
                this.numberOfBatteries--;
                this.maxEnergy -= this.energyStorageParameters.batteryIndividualCapacity;
                useGameParametersStore().addMoney(this.energyStorageParameters.batteryPrice);
            }
        },
        storeEnergy(energyToStore: Consumption) {
            this.storedEnergyList.push(energyToStore);
            this.setValuesFromStoredEnergyList();
        },
        removeStoredEnergy(energyToRemove: Consumption) {
            this.storedEnergyList = this.storedEnergyList.filter((energy) => energy.id !== energyToRemove.id);
            this.setValuesFromStoredEnergyList();
        },
        setValuesFromStoredEnergyList() {
            this.storedEnergy = 0 + this.energyStorageParameters.initialStoredEnergy;
            this.totalStoredEnergyOverTheGame = 0;
            this.storedEnergyList.forEach((energy) => {
                const amountToStore = energy.amount*(energy.endIndex-energy.startIndex+1);
                this.storedEnergy += amountToStore;
                this.totalStoredEnergyOverTheGame += amountToStore;
            });
        },
        clickOnEnergyIcon() {
            this.clickedEnergyIcon = this.clickedEnergyIcon ? false : true;
        },
        clickOnStoreEnergy() {
            this.clickedStoreEnergy = this.clickedStoreEnergy ? false : true;
        },
        clickOnConsumeEnergy() {
            this.clickedConsumeEnergy = this.clickedConsumeEnergy ? false : true;
        },
        clickOnMarketIcon() {
            this.clickedMarketIcon = this.clickedMarketIcon ? false : true;
        },
        clickOnSaleMarket() {
            this.clickedSaleMarket = this.clickedSaleMarket ? false : true;
        },
    },
    getters: {
        getEnergyIcon() {
            if (this.storedEnergy === 0) {
                return 'mdi-battery-outline';
            } else if (this.storedEnergy < this.maxEnergy / 4) {
                return 'mdi-battery-10';
            } else if (this.storedEnergy < this.maxEnergy / 2) {
                return 'mdi-battery-30';
            } else if (this.storedEnergy < (this.maxEnergy / 4) * 3) {
                return 'mdi-battery-50';
            } else if (this.storedEnergy < this.maxEnergy) {
                return 'mdi-battery-70';
            } else if (this.storedEnergy === this.maxEnergy) {
                return 'mdi-battery';
            } else {
                return 'mdi-battery-alert';
            }
        },
        getEnergyIconColor() {
            if (this.storedEnergy === 0) {
                return 'black';
            } else if (this.storedEnergy < this.maxEnergy / 4) {
                return 'red';
            } else if (this.storedEnergy < this.maxEnergy / 2) {
                return 'orange';
            } else if (this.storedEnergy < (this.maxEnergy / 4) * 3) {
                return 'yellow';
            } else if (this.storedEnergy < this.maxEnergy) {
                return 'green';
            } else if (this.storedEnergy === this.maxEnergy) {
                return 'green';
            } else {
                return 'purple';
            }
        },
        getEnergyStoragePercentage(state) {
            if( state.maxEnergy <= 0 || state.storedEnergy <= 0 ){
                return 0;
            }
            return Math.round((state.storedEnergy / state.maxEnergy) * 100);
        },
        getMaximumEnergyStorageWithoutConsumption:(state) => (consumptionId: string) => {
            const consumption = state.storedEnergyList.find((consumption) => consumption.id === consumptionId);
            if( consumption ){
                return state.maxEnergy - state.storedEnergy + consumption.amount*(consumption.endIndex-consumption.startIndex+1);
            }
            return state.maxEnergy;
        },
        canUserAddABattery:(state) => {
            return useGameParametersStore().canWithdrawMoney(state.energyStorageParameters.batteryPrice)
        },
        canUserRemoveABattery:(state) => {
            return state.numberOfBatteries > state.energyStorageParameters.numberOfBatteries
        },
        displayEnergyIcon:(state) => {
            return state.energyStorageParameters.isEnergyStorage;
        },
        displayEnergyMenu:(state) => {
            return state.energyStorageParameters.isEnergyStorage && state.clickedEnergyIcon;
        }
    },
});

export interface EnergyStorage {
    id: string;
    amount: number;
    startIndex: number;
    endIndex: number;
    icon: string;
    color: string;
}
