import { defineStore } from 'pinia';
import { useProductionStore } from './ProductionStore';
import i18n from '../modules/i18n';
import { ScenarioLocale } from '../types/Scenario';
import { ProductionCurve } from '../types/Production';
import { errorScenarioLocale } from '../assets/entityErrorScenario';
import { generateStringId } from '../helpers/idGenerator';
import { Player } from '../types/Multiplayer';
import { errorProductionCurve } from '../assets/entityErrorProduction';

export const useGameParametersStore = defineStore({
    id: 'GameParametersStore',
    state: () => {
        return {
            isGameStarted: false,
            gameId: '00000',
            date: new Date(),
            language: 'en',
            languageIsUserSet: false,
            theme: 'light',
            scenario: errorScenarioLocale as ScenarioLocale,
            productionCurve: errorProductionCurve as ProductionCurve,
            isMultiplayer: false,
            isPublic: false,
            user: {
                id: 'e_balance_plus_game_player_' + generateStringId(),
                name: 'Anonymous_player_' + generateStringId(),
                score: 0,
                moneyWon: 0,
                isConnected: false,
                isHost: false
            } as Player,
            availableMoney: 0,
            showedInfoOverlay: true
        };
    },
    actions: {
        setProductionCurve(productionCurveId: string) {
            const productionCurveImport = useProductionStore().getProductionCurveById(productionCurveId);
            if(productionCurveImport){
                this.productionCurve = productionCurveImport;
            } else{
                this.productionCurve = errorProductionCurve;
            }
        },
        setScenario(scenarioId: string) {
            const scenarioImport = useScenarioStore().getScenarioById(scenarioId);
            if(scenarioImport){
                this.scenario = useScenarioStore().convertScenarioToScenarioLocale(scenarioImport);
            } else{
                this.scenario = errorScenarioLocale;
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
            this.gameId = generateStringId(5);
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
        showInfoOverlay() {
            this.showedInfoOverlay = this.showedInfoOverlay ? false : true;
        }
    },
    getters: {
        getProductionCurve: (state) => state.productionCurve,
        getProductionCurveTotal: (state) => state.productionCurve.total,
        getGameIdUpper: (state) => state.gameId.toUpperCase(),
        isGameMultiplayer: (state) => state.isMultiplayer,
        canWithdrawMoney: (state) => (amount: number) => state.availableMoney >= amount,
        getScenarioEnergyStorageParameters: (state) => state.scenario.energyStorageParameters,
        getScenarioEnergyMarketParameters: (state) => state.scenario.energyMarketParameters,
        getScenarioMoneyParameters: (state) => state.scenario.moneyParameters,
        getUser: (state) => state.user,
        getUserId: (state) => state.user.id,
        isUserHost: (state) => state.user.isHost,
    }
});
