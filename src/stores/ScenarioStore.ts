import { defineStore } from 'pinia';
import { Scenario, ScenarioLocale} from '../types/Scenario';
import { EquipmentType, EquipmentTypeLocale } from '../types/EquipmentType';
import { errorScenario, errorScenarioLocale } from '../assets/entityErrorScenario';
import { convertI18nObjectToLocale } from '../helpers/translation';


export const useScenarioStore = defineStore({ id: "ScenarioStore", 
    state: () => {
        return {
            scenarios: [errorScenario] as Scenario[],
            scenariosLocale: [errorScenarioLocale] as ScenarioLocale[],
            clickedScenario: null as null | ScenarioLocale
        };
    },

    actions: {
        async getAllScenario() {
            const data = (await import ('../data/scenario.json')).default;
            this.scenarios = data as Scenario[];
            this.convertScenarioListToScenarioLocaleList();
            this.clickedScenario = this.scenariosLocale[0];
        },
        setClickedScenario(scenario: ScenarioLocale | null){
            this.clickedScenario = scenario;
        },
        getListOfEquipmentTypeLocale(listEquipmentTypes: EquipmentType[]) {
            const listEquipmentTypesLocales: EquipmentTypeLocale[] = []
            const locale = useGameParametersStore().language;
            for(const equipmentType of listEquipmentTypes ) {
                listEquipmentTypesLocales.push({
                    id: equipmentType.id,
                    name: convertI18nObjectToLocale(equipmentType.names, locale),
                    icon_name: equipmentType.icon_name,
                    color: equipmentType.color,
                    isBattery: equipmentType.isBattery,
                    isCharging: equipmentType.isCharging,
                    equipmentTypeDurationParams: equipmentType.equipmentTypeDurationParams
                } as EquipmentTypeLocale); 
            }
            return listEquipmentTypesLocales;
        },
        //Not sure if it is really best practice
        convertNameToNameLocale(scenario: Scenario) {
            const locale = useGameParametersStore().language;
            return convertI18nObjectToLocale(scenario.names, locale);
        },
        convertDayToDayLocale(scenario: Scenario) {
            const locale = useGameParametersStore().language;
            return convertI18nObjectToLocale(scenario.days, locale);
        },
        convertDescriptionToDescriptionLocale(scenario: Scenario){
            const locale = useGameParametersStore().language;
            return convertI18nObjectToLocale(scenario.descriptions, locale);
        },
        convertScenarioToScenarioLocale(scenario: Scenario) {
            const listEquipmentLocale: EquipmentTypeLocale[] = this.getListOfEquipmentTypeLocale(scenario.equipment_types); 
            const name: string = this.convertNameToNameLocale(scenario);
            const day: string = this.convertDayToDayLocale(scenario);
            const description: string = this.convertDescriptionToDescriptionLocale(scenario);
            const scenarioLocale: ScenarioLocale = {id: scenario.id,
                                                    name: name, 
                                                    day: day, 
                                                    season: scenario.season, 
                                                    icon: scenario.icon, 
                                                    color: scenario.color,
                                                    description: description,
                                                    equipment_type_local: listEquipmentLocale,
                                                    initial_consumption: scenario.initial_consumption,
                                                    energyStorageParameters: scenario.energyStorageParameters,
                                                    energyMarketParameters: scenario.energyMarketParameters,
                                                    moneyParameters: scenario.moneyParameters
                                                }; 
            return scenarioLocale;
        },
        convertScenarioListToScenarioLocaleList(){
            const listScenarioLocale: ScenarioLocale[] = [];
            for(const scenario of this.scenarios) {
                listScenarioLocale.push(this.convertScenarioToScenarioLocale(scenario));
            }
            this.scenariosLocale = listScenarioLocale;
        },

        
        //TODO: Add the internationalisation handler 
    }, 
    getters: {
        getScenarioById:(state)=>(id: string) => {
            return state.scenarios.find(scenario => scenario.id === id);
        }, getEquipmentBySeason:(state)=>(season: string) => {
            return state.scenarios.find(scenario => scenario.season === season);
        },
        getEquipmentTypeFromScenario:(state)=>(scenarioLocale : ScenarioLocale) => {
            const equipmentByTypes : EquipmentTypeLocale[] = [];
            for(const equipment of scenarioLocale.equipment_type_local){
                if(!equipmentByTypes.includes(equipment)){
                    equipmentByTypes.push(equipment);
                }
            }
            return equipmentByTypes;
        },
        getClickedScenario: state => () => state.clickedScenario,
        getRandomLocaleScenario: state => () => state.scenariosLocale[Math.floor(Math.random() * state.scenariosLocale.length)],
        getInitialConsumptionCopy: state => () => {
            if(state.clickedScenario){
                return JSON.parse(JSON.stringify(state.clickedScenario.initial_consumption));
            }
            return [];
        }
    },
});
