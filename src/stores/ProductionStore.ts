import { defineStore } from 'pinia';
import { convertTimesToIndexes } from '../helpers/time';
import { Consumption } from '../types/Consumption';
import { ProductionCurve } from '../types/Production';

export const useProductionStore = defineStore({
    id: 'ProductionStore',
    state: () => {
        return {
            productionCurves: new Map<string, ProductionCurve>(), 
            clickedProductionCurve: null as null | ProductionCurve,
            addedProductionList: [] as Consumption[],
            totalProduction: new Array(96).fill(0) as number[],
        };
    },
    actions: {
        async fetchProductionCurves() {
            const data = (await import ('../data/productionCurves.json')).default;
            const productionCurvesWithoutTotal = new Map(Object.entries(data));
            this.productionCurves = new Map([...productionCurvesWithoutTotal.entries()].map(([key, value]) => {
                const total = this.getProductonCurveTotal(value.solar, value.wind, value.hydro);
                return [key, {...value, total}];
            }));
            this.setClickedProductionCurveToFirstCurve();
        },
        getProductonCurveTotal(solar: number[], wind: number[], hydro: number[]) {
            const solarPoints = solar.length>0 ? solar : new Array(96).fill(0);
            const windPoints = wind.length>0 ? wind : new Array(96).fill(0);
            const hydroPoints = hydro.length>0 ? hydro : new Array(96).fill(0);
            const total = solarPoints.map((solarPoint: number, index: number) => solarPoint + windPoints[index] + hydroPoints[index]);
            return total;
        },
        initTotalProductionFromProductionCurve(productionCurve: ProductionCurve | null) {
            if(productionCurve){
                this.totalProduction = new Array(96).fill(0);
                this.totalProduction = this.totalProduction.map((production: number, index: number) => production + productionCurve.total[index]);
            }
        },
        setClickedProductionCurve(productionCurve: ProductionCurve | null) {
            this.clickedProductionCurve = productionCurve;
            this.initTotalProductionFromProductionCurve(productionCurve);
        }, 
        setClickedProductionCurveToFirstCurve() {
            this.clickedProductionCurve = this.productionCurves.values().next().value;
            this.initTotalProductionFromProductionCurve(this.clickedProductionCurve);
        },
        addToAddedProductionList(addedProduction: Consumption) {
            this.addedProductionList.push(addedProduction);
            this.addAddedProductionToTotalProduction(addedProduction);
            useBoardStore().setTilesFromProductionList();
        },
        removeFromAddedProductionList(addedProductionId: string) {
            const addedProductionToRemove = this.addedProductionList.find(addedProduction => addedProduction.id === addedProductionId);
            if (addedProductionToRemove) {
                this.removeAddedProductionFromTotalProduction(addedProductionToRemove);
                this.addedProductionList = this.addedProductionList.filter(addedProduction => addedProduction.id !== addedProductionId);
                useBoardStore().setTilesFromProductionList();
            }
        },
        modifyAddedProduction(addedProductionId: string,startHour: string, endHour: string, amount: number) {
            const addedProductionToModify = this.addedProductionList.find(addedProduction => addedProduction.id === addedProductionId);
            if (addedProductionToModify) {
                const indexes = convertTimesToIndexes(startHour, endHour);
                this.removeAddedProductionFromTotalProduction(addedProductionToModify);
                addedProductionToModify.startIndex = indexes.indexStart;
                addedProductionToModify.endIndex = indexes.indexEnd;
                addedProductionToModify.amount = amount;
                this.addAddedProductionToTotalProduction(addedProductionToModify);
                useBoardStore().setTilesFromProductionList();
            }
        },
        addAddedProductionToTotalProduction(addedProduction: Consumption) {
            for (let i=addedProduction.startIndex; i<=addedProduction.endIndex; i++) {
                this.totalProduction[i] += addedProduction.amount;
            }
        },
        removeAddedProductionFromTotalProduction(addedProduction: Consumption) {
            for (let i=addedProduction.startIndex; i<=addedProduction.endIndex; i++) {
                this.totalProduction[i] -= addedProduction.amount;
            }
        },
    },
    getters: {
        getProductionCurveById: state => (id: string) => state.productionCurves.get(id),
        getProductionCurveByName: state => (name: string) => {
            for (const curve of state.productionCurves.values()) {
                if (curve.names.find(n => n.text === name)) {
                    return curve;
                }
            }
        },
        getAllProductionCurves: state => () => {
            let allProductionCurves: ProductionCurve[] = []
            for (const curve of state.productionCurves.values()) {
                allProductionCurves.push(curve);
            }
            return allProductionCurves as ProductionCurve[];
        },
        getClickedProductionCurve: state => () => state.clickedProductionCurve,
        getRandomProductionCurve: state => () => {
            let allProductionCurves: ProductionCurve[] = []
            for (const curve of state.productionCurves.values()) {
                allProductionCurves.push(curve);
            }
            const randomIndex = Math.floor(Math.random() * allProductionCurves.length);
            return allProductionCurves[randomIndex];
        },
        getAddedProductionListSortedByStartIndex(state) {
            return state.addedProductionList.sort((a,b) => (a.startIndex > b.startIndex) ? 1 : -1);
        },
        getAddedProductionById: state => (id: string) => state.addedProductionList.find(addedProduction => addedProduction.id === id),
        getTotalProductionCopy: state => () => {
            return JSON.parse(JSON.stringify(state.totalProduction));
        },
    }
});
