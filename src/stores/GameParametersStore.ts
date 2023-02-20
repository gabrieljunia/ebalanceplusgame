import { defineStore } from 'pinia';
import { useProductionStore } from './ProductionStore';
import i18n from '../modules/i18n';
import { ScenarioLocale } from '../types/Scenario';
import { ProductionCurve } from '../types/Production';
import { Consumption } from '../types/Consumption';

export const useGameParametersStore = defineStore({
    id: 'GameParametersStore',
    state: () => {
        return {
            gameId: '00000',
            date: new Date(),
            language: 'en',
            languageIsUserSet: false,
            theme: 'light',
            scenario: {
                id: '0',
                name: 'No scenario',
                day: '',
                season: '',
                icon: '',
                color: '',
                description: '',
                equipment_type_local: [],
                initial_consumption: [{}] as Consumption[],
                energyStorageParameters: {
                    isEnergyStorage: false,
                    initialStoredEnergy: 0,
                    numberOfBatteries: 0,
                    batteryIndividualCapacity: 0,
                    batteryPrice: 0
                }, 
                energyMarketParameters: {
                    normalPrice: 0,
                    initialPricesList: []
                },
                moneyParameters: {
                    initialMoney: 0
                }
            } as ScenarioLocale,
            productionCurve: {
                id: '0',
                name: 'No production curve',
                svg: '',
                description: '', 
                solar: [],
                wind: [],
                hydro: [],
                total: []
            } as ProductionCurve,
            isMultiplayer: false,
            isPublic: false,
            user: '',
            score: 0,
            moneyWon: 0,
            availableMoney: 0
        };
    },
    actions: {
        setProductionCurve(productionCurveId: string) {
            const productionCurveImport = useProductionStore().getProductionCurveById(productionCurveId);
            if(productionCurveImport){
                this.productionCurve = productionCurveImport;
            } else{
                this.productionCurve = {
                    id: '0',
                    name: 'No production curve',
                    svg: '',
                    description: '',
                    solar: [],
                    wind: [],
                    hydro: [],
                    total: []
                };
            }
        },
        setScenario(scenarioId: string) {
            const scenarioImport = useScenarioStore().getScenarioById(scenarioId);
            if(scenarioImport){
                this.scenario = useScenarioStore().convertScenarioToScenarioLocale(scenarioImport);
            } else{
                this.scenario = {
                    id: '0',
                    name: 'No scenario',
                    day: '',
                    season: '',
                    icon: '',
                    color: '',
                    description: '',
                    equipment_type_local: [],
                    initial_consumption: [],
                    energyStorageParameters: {
                        isEnergyStorage: false,
                        initialStoredEnergy: 0,
                        numberOfBatteries: 0,
                        batteryIndividualCapacity: 0,
                        batteryPrice: 0
                    },
                    energyMarketParameters: {
                        normalPrice: 0,
                        initialPricesList: []
                    },
                    moneyParameters: {
                        initialMoney: 0
                    }
                };
            }
        },
        setProductionCurveAndScenario(productionCurve: ProductionCurve | null, scenario: ScenarioLocale | null) {
            if(!productionCurve || !scenario) return;
            this.productionCurve = productionCurve;
            this.scenario = scenario;
            useEnergyStore().initializeEnergyStore();
        },
        setRandomProductionCurveAndScenario() {
            const randomProductionCurve = useProductionStore().getRandomProductionCurve();
            const randomScenario = useScenarioStore().getRandomLocaleScenario();
            this.setProductionCurveAndScenario(randomProductionCurve, randomScenario);
        },
        setLanguageFromBrowser() {
            if(!this.languageIsUserSet){
                const language = navigator.language.substring(0, 2);
                if(language && this.isLanguageAvailable(language)){
                    this.language = language;
                } else{
                    this.language = 'en';
                }
            }
        },
        isLanguageAvailable(languageId: string) {
            for (const language of i18n.global.availableLocales) {
                if(languageId === language){
                    return true;
                }
            }
        },
        setLanguage(languageId: string) {
            if(this.isLanguageAvailable(languageId)){
                this.language = languageId;
                i18n.global.locale.value = i18n.global.availableLocales.find((locale) => locale === languageId) || 'en';
                this.languageIsUserSet = true;
            }
        },
        generateGameId() {
            this.gameId = Math.random().toString(36).substr(2, 5);
        },
        createGame(isMultiplayer: boolean, isPublic: boolean) {
            this.isMultiplayer = isMultiplayer;
            this.isPublic = isPublic;
        },
        withdrawMoney(amount: number) {
            this.availableMoney -= amount;
        },
        addMoney(amount: number) {
            this.availableMoney += amount;
        },
    },
    getters: {
        getProductionCurve: (state) => state.productionCurve,
        getGameIdUpper: (state) => state.gameId.toUpperCase(),
        canWithdrawMoney: (state) => (amount: number) => state.availableMoney >= amount,
        getScenarioEnergyStorageParameters: (state) => state.scenario.energyStorageParameters
    }
});
