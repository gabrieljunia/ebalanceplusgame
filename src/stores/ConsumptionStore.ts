import { defineStore } from 'pinia';
import { useGameParametersStore } from './GameParametersStore';
import { useEnergyStore } from './EnergyStore';
import { useBoardStore } from './BoardStore';
import { Consumption, ConsumptionCurve } from '../types/Consumption';
import { Equipment } from '../types/Equipment';

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
            let clickedScenario = useScenarioStore().clickedScenario;
            if(clickedScenario){
                for(let initialConsumption of clickedScenario.initial_consumption){
                    this.addToConsumptionList(initialConsumption);
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
                const indexes = this.convertTimesToIndexes(startHour, endHour);
                consumptionToModify.startIndex = indexes.indexStart;
                consumptionToModify.endIndex = indexes.indexEnd;
                for(let i=consumptionToModify.startIndex; i<=consumptionToModify.endIndex; i++){
                    this.addToConsumptionCurve(i,consumptionToModify.amount)
                }
                this.setListOfOverConsumption();
                useBoardStore().setTilesFromConsumptionList();
                if(consumptionToModify.equipment.type.isBattery){
                    useEnergyStore().setValuesFromStoredEnergyList();
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
                    useEnergyStore().setValuesFromStoredEnergyList();
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
            const productionCurve = useGameParametersStore().getProductionCurve;
            if (productionCurve) {
                for (const [time, consumption] of this.consumptionCurve.consumption) {
                    if (consumption > productionCurve.total[time]) {
                        this.overConsumptionMap.set(time, consumption - productionCurve.total[time]);
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
        },
        convertTimeToIndex(hour: string): (number) {
            let listHour: string[] = hour.split(":", 2);
            let h:number = Number(listHour[0]);
            let m:number = Number(listHour[1]);
            let index:number = h*4+ m/15;
            return index;
        },
        convertIndexToTime(index:number) {
            let h:number = Math.floor(index/4);
            let m:number = (index%4)*15;
            let time:string = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
            return time;
        },
        convertIndexesToTimes(indexStart:number, indexEnd:number) {
            let timeStart:string = this.convertIndexToTime(indexStart);
            let timeEnd:string = this.convertIndexToTime(indexEnd+1);
            return {timeStart:timeStart, timeEnd:timeEnd};
        },
        convertTimesToIndexes(timeStart:string, timeEnd:string) {
            let indexStart:number = this.convertTimeToIndex(timeStart);
            let indexEnd:number = this.convertTimeToIndex(timeEnd)-1;
            return {indexStart:indexStart, indexEnd:indexEnd};
        },
        checkTimeInput(timeStart:string, timeEnd:string) {
            if(timeStart === '' || timeEnd === ''){
                return false;
            }
            let indexStart:number = this.convertTimeToIndex(timeStart);
            let indexEnd:number = this.convertTimeToIndex(timeEnd)-1;
            if(indexStart > indexEnd || indexStart < 0 || indexEnd > 95){
                return false;
            }
            return true;
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
        }
    }
});
