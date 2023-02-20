import { defineStore } from "pinia";
// import { ProductionCurve } from "../types/Production";
import { Scenario, ScenarioLocale } from "../types/Scenario";

export const useMoneyStore = defineStore({
    id: 'MoneyStore',
    state: () => {
        return {
            money: 0 as number,
            price: 0 as number,
            priceSale: [] as number[],
        };
    }, 
    actions: {

        addMoney(newMoney: number) {
            this.money = this.money + newMoney;
        },
        takeMoney(offMoney: number) {
            this.money =- offMoney;
        },
        getTotalPrice(step: number, amount: number, startIndex: number, endIndex: number){
            const priceInside: number = this.getPriceInsideIndex(startIndex, endIndex);
            const multiplier: number = amount/step;
            return priceInside*multiplier;
        },

        getPriceInsideIndex(startIndex: number, endIndex: number) {
            const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(scenario){
                const pricesList: number[] = scenario.energyMarketParameters.initialPricesList;
                let totalPrice: number = 0;
                for( let i=startIndex; i<endIndex; i++) {
                    totalPrice += pricesList[i];
                }
                return totalPrice;
            } else {
                return 0;
            }
        },
        getMoney(){
            const clickedScenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(clickedScenario)
                this.money = clickedScenario.moneyParameters.initialMoney;
        }
    },
    getters: {
        getInitialMoney:(state)=> () => {
            const scenario: ScenarioLocale|null = useScenarioStore().clickedScenario;
            if(scenario){
                state.money = scenario.moneyParameters.initialMoney;
            } else {
                state.money = 0;
            }
            return state.money;
        }
    },
})
