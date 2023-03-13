import { defineStore } from "pinia";
import { ScenarioLocale } from "../types/Scenario";
import { errorMoneyParameters } from "../assets/entityErrorMoneyParameters";
import { MoneyParameters } from "../types/Money";

export const useMoneyStore = defineStore({
    id: "MoneyStore",
    state: () => {
        return {
            money: 0 as number,
            moneyParameters: errorMoneyParameters as MoneyParameters,
            priceConstant: 0 as number, 
            pricesList: [] as number[]
        };
    },
    actions: {
        setInitialMoney(){
            this.moneyParameters = useGameParametersStore().getScenarioMoneyParameters;
            if(this.moneyParameters.isMoneyUnlimited) {
                this.money = Number.MAX_SAFE_INTEGER;
            } else {
                this.money = this.moneyParameters.initialMoney;
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
        canWithdrawMoney(moneyToWithdraw: number) {
            if(this.money >= moneyToWithdraw)
                return true;
            else
                return false;
        },
        withdrawMoney(moneyToWithdraw: number) {
            if(this.canWithdrawMoney(moneyToWithdraw)) {
                this.money = this.money - moneyToWithdraw;
                return true;
            } else {
                return false;
            }
        },
        takeOffMoney(moneyToTakeOff: number) {
            if(this.checkIfMoneyCanBeTakeOff(moneyToTakeOff))
                this.money = this.money - moneyToTakeOff;
            else
                console.log("error") //TODO make a real error message
        },
        setTotalPriceList(){
            const scenario: ScenarioLocale | null = useScenarioStore().clickedScenario;
            if(scenario) {
                this.pricesList = scenario.energyMarketParameters.salePricesList
            }
        },
        getPriceInsideIndexes(startIndex: number, endIndex: number, amount: number, step: number) {
            let totalPrice: number = 0;
            const multiplier: number = amount/step;
            for(let i=startIndex; i<endIndex; i++) {
                totalPrice += this.pricesList[i]
            }
            return totalPrice*multiplier;
        }
    }, 
    getters: {
        getMoneyCurrency: (state) => {
            return state.moneyParameters.moneyCurrency;
        },
        getMoneyCurrencyIcon: (state) => {
            return state.moneyParameters.moneyCurrencyIcon;
        },
        displayMoneyIcon: (state) => {
            return state.moneyParameters.isMoneyMenu;
        },
        getMoneyAmountToDisplay: (state) => {
            if(state.moneyParameters.isMoneyUnlimited) {
                return "∞";
            } else {
                return state.money;
            }
        }
    }
})
