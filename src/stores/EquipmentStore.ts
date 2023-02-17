import { defineStore } from 'pinia';
import { Equipment, EquipmentLocale } from '../types/Equipment';
import { EquipmentType, EquipmentTypeLocale } from '../types/EquipmentType';

export const useEquipmentStore = defineStore({id :'EquipmentStore',
    state: () => {
        return {
            equipments: [{
                id: '0',
                energy_class: '',
                type:{
                    id:'0',
                    names: 
                    [{lang: 'fr',name: 'Vide'},
                    {lang: 'en',name: 'Empty'}],
                    icon_name:'vide',
                    color: '#000000',
                    isBattery: false,
                    equipmentTypeDurationParams: {
                        isDurationEditable: true,
                        isDurationLengthEditable: true,
                        originalDuration: '00:15',
                        step: '00:15',
                        minDuration: '00:15',
                        maxDuration: '23:45'
                    },
                },
                equipmentCostParams: {
                    originalPrice: 0,
                    hasCost: false,
                    isCostEditable: false,
                    step: 0,
                    minCost: 0,
                    maxCost: 0
                },
                equipmentConsumptionParams: {
                    originalConsumption: 0,
                    isConsumptionEditable: false,
                    step: 0,
                    minConsumption: 0,
                    maxConsumption: 0
                },
            }] as Equipment [],
            clickedEquipment: null as null | Equipment
        };
    },
    actions: {
        async getEquipmentData() {
            const data = (await import ('../data/equipments.json')).default;
            this.equipments = data as Equipment[];
        },
        setClickedEquipment(equipment: Equipment | null) {
            this.clickedEquipment = equipment;
        },
        getEquipmentTypeLocale(type: EquipmentType, locale:string){
            for(const name of type.names) {
                if(name.lang === locale){
                    return {
                        id: type.id,
                        name: name.name,
                        icon_name: type.icon_name,
                        color: type.color,
                        isBattery: type.isBattery,
                        equipmentTypeDurationParams: type.equipmentTypeDurationParams
                    } as EquipmentTypeLocale;
                }
            }
            return {
                id: type.id,
                name: type.names[0].name,
                icon_name: type.icon_name,
                color: type.color,
                isBattery: type.isBattery,
                equipmentTypeDurationParams: type.equipmentTypeDurationParams
            } as EquipmentTypeLocale;
        },
        getListOfEquipmentTypesLocale() {
            const locale = useGameParametersStore().language;
            const equipmentTypesLocale: EquipmentTypeLocale[] = [];
            for(const equipment of this.equipments) {
                const equipmentTypeLocale = this.getEquipmentTypeLocale(equipment.type, locale);
                if(!equipmentTypesLocale.find(type => type.id === equipmentTypeLocale.id))
                    equipmentTypesLocale.push(equipmentTypeLocale);
            }
            return equipmentTypesLocale;
        },
        convertEquipmentToEquipmentLocale(equipment: Equipment) {
            const locale = useGameParametersStore().language;
            const equipmentTypeLocale = this.getEquipmentTypeLocale(equipment.type, locale);
            return {
                id: equipment.id,
                energy_class: equipment.energy_class,
                type: equipmentTypeLocale,
                equipmentCostParams: equipment.equipmentCostParams,
                equipmentConsumptionParams: equipment.equipmentConsumptionParams
            } as EquipmentLocale;
        }
    },
    getters: {
        getEquipmentById:(state) => (id: string) => {
            return state.equipments.find(equipment => equipment.id === id);
        },
        getEquipmentByTypeId:(state) => (id:string) => {
            const equipmentByType: Equipment[] = [];
            for(const equipment of state.equipments) {
                if(equipment.type.id === id)
                    equipmentByType.push(equipment);
            }
            return equipmentByType;
        },
        getListOfEquipmentTypes: (state) => () => {
            const equipmentTypes: EquipmentType[] = [];
            for(const equipment of state.equipments) {
                if(!equipmentTypes.includes(equipment.type))
                    equipmentTypes.push(equipment.type);
            }
        }
    },
});
