import { defineStore } from "pinia";
import { ScenarioLocale } from "../types/Scenario";

export const useMoneyStore = defineStore({
    id: "MoneyStore",
    state: () => {
        return {
            money: 0 as number, 
            priceConstant: 0 as number, 
            pricesList: [] as number[],
            priceOfConsumption: 0 as number,
        };
    },
    actions: {

        setInitialMoney(){
            const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(scenario) {
                this.money = scenario.moneyParameters.initialMoney;
            }
        },
        setInitialPrice() {
            const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(scenario) {
                this.pricesList = scenario.energyMarketParameters.salePricesList;
                this.priceConstant = scenario.energyMarketParameters.constantPrice;
            }
        },
        addMoney(moneyToAdd: number) {
            this.money = this.money + moneyToAdd;
        },
        checkIfMoneyCanBeTakeOff(moneyToTakeOff: number) {
            if(this.money > moneyToTakeOff)
                return true;
            else
                return false;
        },
        takeOffMoney(moneyToTakeOff: number) {
            if(this.checkIfMoneyCanBeTakeOff(moneyToTakeOff))
                this.money = this.money - moneyToTakeOff;
            else
                console.log("error"); //TODO make a real error message
        },
        getPriceInsideIndexes(startIndex: number, endIndex: number, amount: number, step: number) {
            let totalPrice: number = 0;
            const multiplier: number = amount/step;
            for(let i=startIndex; i<endIndex; i++) {
                totalPrice += this.pricesList[i];
            }
            this.priceOfConsumption = totalPrice*multiplier;
            return this.priceOfConsumption;   
        }
    }, 
    getters: {
        
    }
})