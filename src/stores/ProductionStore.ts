import { defineStore } from 'pinia';

export const useProductionStore = defineStore({
    id: 'ProductionStore',
    state: () => {
        return {
            productionCurves: new Map<string, ProductionCurve>(), 
            clickedProductionCurve: null as null| ProductionCurve, // Add from Antoine
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
        },
        getProductonCurveTotal(solar: number[], wind: number[], hydro: number[]) {
            const solarPoints = solar.length>0 ? solar : new Array(96).fill(0);
            const windPoints = wind.length>0 ? wind : new Array(96).fill(0);
            const hydroPoints = hydro.length>0 ? hydro : new Array(96).fill(0);
            const total = solarPoints.map((solarPoint: number, index: number) => solarPoint + windPoints[index] + hydroPoints[index]);
            return total;
        },
        storeToLocalStorage() {
            localStorage.setItem('productionCurves', JSON.stringify(this.productionCurves));
        },
        getFromLocalStorage() {
            this.productionCurves = new Map(JSON.parse(localStorage.getItem('productionCurves') || '{}'));
        },
        //Add from Antoine
        setClickedProductionCurve(productionCurve: ProductionCurve | null) {
            this.clickedProductionCurve = productionCurve;
        }, 
    },
    getters: {
        getProductionCurveById: state => (id: string) => state.productionCurves.get(id),
        getProductionCurveByName: state => (name: string) => {
            for (const curve of state.productionCurves.values()) {
                if (curve.name === name) {
                    return curve;
                }
            }
        },

        //Add from Antoine
        getAllProductionCurves: state => () => {
            let allProductionCurves: ProductionCurve[] = []
            for (const curve of state.productionCurves.values()) {
                allProductionCurves.push(curve);
            }
            return allProductionCurves;
        }

    }
});

export interface ProductionCurve {
    id : string;
    name: string;
    svg: string;
    description: string,
    solar: number[];
    wind: number[];
    hydro: number[];
    total: number[];
}
