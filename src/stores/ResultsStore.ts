import { emptyResultsConfirmationWindowParameters, emptyResultsPerformanceIndicators } from "../assets/entityEmptyResults";
import { Consumption } from "../types/Consumption";
import { ResultsConfirmationWindowParameters, ResultsPerformanceIndicators } from "../types/Results";

export const useResultsStore = defineStore({
    id: "ResultsStore",
    state: () => {
        return {
            resultsConfirmationWindowParameters: emptyResultsConfirmationWindowParameters as ResultsConfirmationWindowParameters,
            initialSituationPerformanceIndicators: emptyResultsPerformanceIndicators as ResultsPerformanceIndicators,
            finalSituationPerformanceIndicators: emptyResultsPerformanceIndicators as ResultsPerformanceIndicators
        };
    },
    actions: {
        openResultsConfirmationWindow() {
            this.resultsConfirmationWindowParameters.isConfirmationWindowOpen = true;
        },
        closeResultsConfirmationWindow() {
            this.resultsConfirmationWindowParameters.isConfirmationWindowOpen = false;
        },
        calculatePerformanceIndicators(consumptionList : Consumption[], totalProductionList: number[], overConsumptionMap: Map<number, number>, listOfSoldEnergy: Consumption[], listOfBoughtEnergy: Consumption[]) {
            const totalConsumption = consumptionList.reduce((accumulator, currentValue) => accumulator + (currentValue.amount*((currentValue.endIndex - currentValue.startIndex)+1)), 0);
            const totalProduction = totalProductionList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const totalOverConsumption = Array.from(overConsumptionMap.values()).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            const consumptionListWithoutSoldEnergy = consumptionList.filter(consumption => !listOfSoldEnergy.some(soldEnergy => soldEnergy.id === consumption.id));
            const productionListWithoutBoughtEnergy = totalProductionList.map((production, index) => production - listOfBoughtEnergy.filter(boughtEnergy => boughtEnergy.startIndex <= index && boughtEnergy.endIndex >= index).reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0));
            const overConsumptionMapWithoutBoughtAndSoldEnergy = this.calculateOverConsumptionMap(consumptionListWithoutSoldEnergy, productionListWithoutBoughtEnergy);
            const totalOverConsumptionWithoutBoughtAndSoldEnergy = Array.from(overConsumptionMapWithoutBoughtAndSoldEnergy.values()).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            const totalSoldEnergy = listOfSoldEnergy.reduce((accumulator, currentValue) => accumulator + (currentValue.amount*((currentValue.endIndex - currentValue.startIndex)+1)), 0);
            const totalBoughtEnergy = listOfBoughtEnergy.reduce((accumulator, currentValue) => accumulator + (currentValue.amount*((currentValue.endIndex - currentValue.startIndex)+1)), 0);
            
            const selfConsumptionRatio = ((totalConsumption-totalOverConsumption)-totalSoldEnergy) / (totalProduction-totalBoughtEnergy);
            // ou const selfConsumptionRatio = (totalConsumption-totalOverConsumption) / (totalProduction-totalBoughtEnergy);
            
            const selfProductionRatio = (totalConsumption-totalSoldEnergy-totalOverConsumptionWithoutBoughtAndSoldEnergy)/(totalConsumption-totalSoldEnergy);
            return {
                totalConsumption: totalConsumption,
                totalProduction: totalProduction,
                totalOverConsumption: totalOverConsumption,
                totalSoldEnergy: totalSoldEnergy,
                totalBoughtEnergy: totalBoughtEnergy,
                totalStoredEnergy: useEnergyStore().getTotalStoredEnergyOverTheGameCopy,
                totalUsedStoredEnergy: useEnergyStore().getTotalUsedEnergyOverTheGameCopy,
                selfConsumptionRatio: selfConsumptionRatio,
                selfProductionRatio: selfProductionRatio
            } as ResultsPerformanceIndicators;
        },
        calculateOverConsumptionMap(consumptionList : Consumption[], productionList: number[]) {
            const overConsumptionMap = new Map<number, number>();
            consumptionList.forEach(consumption => {
                for(let i = consumption.startIndex; i <= consumption.endIndex; i++) {
                    if(consumption.amount > productionList[i]) {
                        overConsumptionMap.set(i, (overConsumptionMap.get(i) ?? 0) + (consumption.amount - productionList[i]));
                    }
                }
            });
            return overConsumptionMap;
        },
        setInitialSituationPerformanceIndicators() {
            const consumptionList = useScenarioStore().getInitialConsumptionCopy();
            const totalProductionList = useProductionStore().getTotalProductionCopy();
            const overConsumptionMap = useConsumptionStore().getOverConsumptionMapCopy;
            this.initialSituationPerformanceIndicators = this.calculatePerformanceIndicators(consumptionList, totalProductionList, overConsumptionMap, [], []);
        },
        setFinalSituationPerformanceIndicators() {
            const consumptionList = useConsumptionStore().getConsumptionList;
            const totalProductionList = useProductionStore().getTotalProductionCopy();
            const overConsumptionMap = useConsumptionStore().getOverConsumptionMapCopy;
            const listOfSoldEnergy = [] as Consumption[];
            const listOfBoughtEnergy = [] as Consumption[];
            this.finalSituationPerformanceIndicators = this.calculatePerformanceIndicators(consumptionList, totalProductionList, overConsumptionMap, listOfSoldEnergy, listOfBoughtEnergy);
        }
    },
    getters: {
        getIsConfirmationWindowOpen: (state) => {
            return state.resultsConfirmationWindowParameters.isConfirmationWindowOpen;
        },
        getConfirmationButtonIcon: (state) => {
            return state.resultsConfirmationWindowParameters.confirmationButtonIcon;
        },
        getInitialSituationPerformanceIndicators: (state) => {
            return state.initialSituationPerformanceIndicators;
        },
        getFinalSituationPerformanceIndicators: (state) => {
            return state.finalSituationPerformanceIndicators;
        }
    }
});
