<script setup lang="ts">
    import { useEnergyStore } from '../stores/EnergyStore';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
    import { Equipment } from '../types/Equipment';
    import CardPopup from './CardPopup.vue';
    import { generateStringId } from '../helpers/idGenerator';
</script>

<template>
    <CardPopup
        :id="consumptionId"
        :type="type"
        :props-amount="amount"
        :props-max-energy-amount="maxAmount"
        :props-price="price"
        :equipment="equipment"
        :indexes="{start:startIndex,end:endIndex}"
        :props-is-initial-add-popup="true"
        @close-popup="closePopup"
        @save="saveConsumption"
        @cancel="closePopup"
        @delete="closePopup"
        @amount-error="amountError"
        @time-error="timeError"/>
</template>

<script lang="ts">
    export default {
        name: 'EnergyMenuAddEnergyWindow',
        components: {
            CardPopup
        },
        data() {
            return {
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                consumptionId: '',
                type: this.$t("energy.storeEnergy"),
                startIndex: 0 as number,
                endIndex: 0 as number,
                maxAmount: 10 as number,
                amount: 0 as number,
                price: 0,
                equipment: {
                    id: '0',
                    energy_class: '',
                    type: useEnergyStore().batteryChargeEquipmentType,
                    equipmentCostParams:{
                        originalPrice: 0,
                        hasCost: false,
                        isCostEditable: false,
                        step: 0,
                        minCost: 0,
                        maxCost: 0
                    },
                    equipmentConsumptionParams:{
                        originalConsumption: 0,
                        isConsumptionEditable: true,
                        step: 10,
                        minConsumption: 0,
                        maxConsumption: useEnergyStore().getMaxChargeRate
                    },
                } as Equipment,
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickOnStoreEnergy();
            },
            saveConsumption(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                this.consumptionStore.addConsumption(save.startIndex, save.endIndex, this.equipment, save.amount, save.price);
                this.energyStore.clickOnStoreEnergy();
            },
            amountError() {
                alert(this.$t('error.amountErrorHigherThanEnergyStorageCapacity'));
            },
            timeError() {
                alert(this.$t('error.timeError'));
            }
        },
        mounted() {
            this.equipment.id = generateStringId();
            this.consumptionId = generateStringId();
        }
    }
</script>
