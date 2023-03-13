import { defineStore } from 'pinia';
import { errorEquipment } from '../assets/entityErrorEquipment';
import { convertI18nObjectToLocale } from '../helpers/translation';
import { Equipment, EquipmentLocale } from '../types/Equipment';
import { EquipmentType, EquipmentTypeLocale } from '../types/EquipmentType';

export const useEquipmentStore = defineStore({id :'EquipmentStore',
    state: () => {
        return {
            equipments: [errorEquipment] as Equipment [],
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
            return {
                id: type.id,
                name: convertI18nObjectToLocale(type.names, locale),
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
