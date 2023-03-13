import { defineStore } from 'pinia';
import { useEnergyStore } from './EnergyStore';
import { useBoardStore } from './BoardStore';
import { Consumption, ConsumptionCurve } from '../types/Consumption';
import { Equipment } from '../types/Equipment';
import { convertTimesToIndexes } from '../helpers/time';

export const useConsumptionStore = defineStore({
    id: 'ConsumptionStore',
    state: () => {
        return {
            consumptionCurve: {
                consumption: new Map<number, number>(),
                peak: 0,
                peakIndex: 0,
                peakTime: "00:00"
            } as ConsumptionCurve,
            consumptionList: [] as Consumption[],
            overConsumptionMap: new Map() as Map<number, number>
        };
    },

    actions: {
        addInitialConsumptionToConsumptionList() {
            const initialConsumption = useScenarioStore().getInitialConsumptionCopy();
            if(initialConsumption){
                this.consumptionList = [];
                for(const consumption of initialConsumption){
                    this.addToConsumptionList(consumption);
                }   
            }
        },
        addToConsumptionList(newConsumption:Consumption) {
            this.consumptionList.push(newConsumption)
            for(let i=newConsumption.startIndex; i<=newConsumption.endIndex; i++){
                this.addToConsumptionCurve(i,newConsumption.amount)
            }
            this.setListOfOverConsumption();
            useBoardStore().setTilesFromConsumptionList();
            if(newConsumption.equipment.type.isBattery){
                useEnergyStore().storeEnergy(newConsumption);
            }
        },
        removeFromConsumptionList(consumptionId:string) {
            const consumptionToRemove = this.consumptionList.find(consumption => consumption.id === consumptionId);
            if(consumptionToRemove){
                for(let i=consumptionToRemove.startIndex; i<=consumptionToRemove.endIndex; i++){
                    this.removeFromConsumptionCurve(i,consumptionToRemove.amount)
                }
                this.consumptionList = this.consumptionList.filter(consumption => consumption.id !== consumptionId);
                this.setListOfOverConsumption();
                useBoardStore().setTilesFromConsumptionList();
                if(consumptionToRemove.equipment.type.isBattery){
                    useEnergyStore().removeStoredEnergy(consumptionToRemove);
                }
            }
        },
        modifyConsumptionHours(consumptionId:string, startHour:string, endHour:string) {
            const consumptionToModify = this.consumptionList.find(consumption => consumption.id === consumptionId);
            if(consumptionToModify){
                for(let i=consumptionToModify.startIndex; i<=consumptionToModify.endIndex; i++){
                    this.removeFromConsumptionCurve(i,consumptionToModify.amount)
                }
                const indexes = convertTimesToIndexes(startHour, endHour);
                consumptionToModify.startIndex = indexes.indexStart;
                consumptionToModify.endIndex = indexes.indexEnd;
                for(let i=consumptionToModify.startIndex; i<=consumptionToModify.endIndex; i++){
                    this.addToConsumptionCurve(i,consumptionToModify.amount)
                }
                this.setListOfOverConsumption();
                useBoardStore().setTilesFromConsumptionList();
                if(consumptionToModify.equipment.type.isBattery){
                    useEnergyStore().updateValues();
                }
            }
        },
        modifyConsumptionAmount(consumptionId:string, amount:number) {
            const consumptionToModify = this.consumptionList.find(consumption => consumption.id === consumptionId);
            if(consumptionToModify){
                for(let i=consumptionToModify.startIndex; i<=consumptionToModify.endIndex; i++){
                    this.removeFromConsumptionCurve(i,consumptionToModify.amount)
                }
                consumptionToModify.amount = amount;
                for(let i=consumptionToModify.startIndex; i<=consumptionToModify.endIndex; i++){
                    this.addToConsumptionCurve(i,consumptionToModify.amount)
                }
                this.setListOfOverConsumption();
                useBoardStore().setTilesFromConsumptionList();
                if(consumptionToModify.equipment.type.isBattery){
                    useEnergyStore().updateValues();
                }
            }
        },
        addToConsumptionCurve(index:number, value:number) {
            const existingConsumption = this.consumptionCurve.consumption.get(index)
            if(existingConsumption){
                value = value + existingConsumption;
            }
            this.consumptionCurve.consumption.set(index, value);
        },
        removeFromConsumptionCurve(index:number, value:number) {
            const existingConsumption = this.consumptionCurve.consumption.get(index)
            if(existingConsumption){
                this.consumptionCurve.consumption.set(index, existingConsumption - value);
            }
        },
        setListOfOverConsumption() {
            this.overConsumptionMap.clear();
            const totalProduction = useProductionStore().totalProduction;
            if (totalProduction) {
                for (const [time, consumption] of this.consumptionCurve.consumption) {
                    if (consumption > totalProduction[time]) {
                        this.overConsumptionMap.set(time, consumption - totalProduction[time]);
                    }
                }
            }
        },
        addConsumption(indexStart: number, indexEnd: number, equipment: Equipment, amount: number, price: number) {
            let id: string = Math.floor(Math.random() * (1000000)).toString();
            let newConsumption: Consumption = { id:id,
                startIndex:indexStart,
                endIndex: indexEnd,
                amount:amount,
                price:price,
                equipment:equipment };
            this.addToConsumptionList(newConsumption);
        }
    },

    getters: {
        isOverConsumption(state) {
            return state.overConsumptionMap.size > 0;
        },
        getConsumptionListSortedByStartIndex(state) {
            // return List of consumptions in ConsumptionList ordered by start index (asc)
            return state.consumptionList.sort((a,b) => (a.startIndex > b.startIndex) ? 1 : -1)
        },
        getConsumptionById(state) {
            return (id:string) => {
                return state.consumptionList.find(consumption => consumption.id === id)
            }
        },
        getOverConsumptionMapCopy(state) {
            return new Map(state.overConsumptionMap);
        },
        getConsumptionList(state) {
            return state.consumptionList;
        },
    }
});
