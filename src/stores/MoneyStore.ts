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
        setInitialMoneyAndPriceOfEnergy() {
            const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(scenario) {
                this.money = scenario.moneyParameters.initialMoney;
                this.pricesList = scenario.energyMarketParameters.salePricesList;
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
                console.log("error"); // TODO make a real error message
        },
        // getPriceInsideIndexes(startIndex: number, endIndex: number, amount: number, step: number) {
        //     let totalPrice: number = 0;
        //     const multiplier: number = amount/step;
        //     for(let i=startIndex; i<endIndex; i++) {
        //         totalPrice += this.pricesList[i];
        //     }
        //     this.priceOfConsumption = totalPrice*multiplier;
        //     return this.priceOfConsumption;   
        // },
        // getPriceInsideIndexes(startIndex: number, endIndex: number, amount: number, step: number){
        //     let totalPrice: number = 0;
        //     const multiplier: number = amount/step;
        //     const price: number | number[] | undefined = this.getTypePrice();
        //     for(let i=startIndex; i<endIndex; i++) {
        //         if(typeof price == "number" ){
        //             totalPrice += price;
        //         }
        //         else {
        //             totalPrice += this.pricesList[i];
        //         }
        //         this.priceOfConsumption = totalPrice*multiplier;
        //         return this.priceOfConsumption;
        //     }
        // },
        // getTypePriceInClickedScenario(){
        //     const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
        //     if(scenario != null) {
        //         if(scenario.energyMarketParameters.constantPrice == 0) {
        //             return scenario.energyMarketParameters.salePricesList;
        //         } else if( scenario.energyMarketParameters.salePricesList.length == 0) {
        //             return scenario.energyMarketParameters.constantPrice;
        //         }
        //     } else if( scenario == null) {
        //         return 0 ;
        //     }
        // }

        getTotalPrice(step: number, amount: number, startIndex: number, endIndex: number){
            const priceInside: number = this.getPriceInsideIndex(startIndex, endIndex);
            const multiplier: number = amount/step;
            this.priceOfConsumption =  priceInside*multiplier;
            console.log("cons price " + this.priceOfConsumption);
        },

        getPriceInsideIndex(startIndex: number, endIndex: number) {
            const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(scenario){
                const pricesList: number[] = scenario.energyMarketParameters.salePricesList;
                let totalPrice: number = 0;
                for( let i=startIndex; i<endIndex; i++) {
                    totalPrice += pricesList[i];
                }
                console.log("total price " + totalPrice);
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
        
    }
})