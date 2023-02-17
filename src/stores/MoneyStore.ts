import { defineStore } from "pinia";
import { ProductionCurve } from "../types/Production";

export const useMoneyStore = defineStore({
    id: 'MoneyStore',
    state: () => {
        return {
            money: 0 as number,
            priceSale: [] as number[],
        };
    }, 
    actions: {
        addMoney(newMoney: number) {
            this.money =+ newMoney;
        },
        takeMoney(offMoney: number) {
            this.money =- offMoney;
        },
        getPriceByIndexAndByProduction(productionCurve: ProductionCurve) {
            const totalProdCurve = productionCurve.total;
            let priceByIndex: number[] = [];
            const maxProd: number = Math.max(...totalProdCurve); 
            const minProd: number = Math.min(...totalProdCurve);
            for(let i=0; i<96; i++){
                
            }
        },

        getPrice(productionCurve : ProductionCurve) {

        }
    },
    getters: {

    },
})



