import { defineStore } from 'pinia';
import { Consumption } from '../types/Consumption';

export const useEnergyStore = defineStore({
    id: 'EnergyStore',
    state: () => {
        return {
            storedEnergy: 0 as number,
            maxEnergy: 200 as number,
            totalStoredEnergyOverTheGame: 0 as number,
            totalUSedEnergyOverTheGame: 0 as number,
            numberOfBatteries: 1 as number,
            batteryIndividualCapacity: 200 as number,
            batteryPrice: 0 as number,
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
        addBattery() {
            this.numberOfBatteries++;
            this.maxEnergy += this.batteryIndividualCapacity;
        },
        removeBattery() {
            if (this.numberOfBatteries > 1) {
                this.numberOfBatteries--;
                this.maxEnergy -= this.batteryIndividualCapacity;
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
            this.storedEnergy = 0;
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
        getEnergyStorageConsumption(state) {
            return {
                id:"951283",
                startIndex:45,
                endIndex:45,
                amount:state.maxEnergy-state.storedEnergy,
                color:"orange",
                equipment:{
                    id:99,
                    type:{
                        id:"energyStorage",
                        names:[
                            {name:"Stocker de l'énergie",lang:"fr"},
                            {name:"Store energy",lang:"en"}],
                            icon_name:"mdi:battery-charging-100",
                            color:"orange",
                            isConsumptionEditable:true,
                            hasCost:false
                    },
                    energy_class:"X",
                    consumption:0,
                    points:0,
                    price:0
                }
            }
        },
        getMaximumEnergyStorageWithoutConsumption:(state) => (consumptionId: string) => {
            const consumption = state.storedEnergyList.find((consumption) => consumption.id === consumptionId);
            if( consumption ){
                return state.maxEnergy - state.storedEnergy + consumption.amount*(consumption.endIndex-consumption.startIndex+1);
            }
            return state.maxEnergy;
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
