<script setup lang="ts">
    import { generateStringId } from '../helpers/idGenerator';
    import { Consumption } from '../types/Consumption';
    import { Equipment } from '../types/Equipment';
    import CardPopup from './CardPopup.vue';
</script>

<template>
    <CardPopup
        :id="energyConsumption.id"
        :equipment="energyConsumption.equipment"
        :type="type"
        :props-amount="energyConsumption.amount"
        :props-max-energy-amount="maxAmount"
        :props-price="energyConsumption.price"
        :props-is-initial-add-popup="true"
        :indexes="{start: energyConsumption.startIndex, end: energyConsumption.endIndex}"
        @close-popup="closePopup"
        @save="saveEnergyUse"
        @cancel="closePopup"
        @delete="closePopup"
        @amount-error="amountError"
        @time-error="timeError"/>
</template>

<script lang="ts">
    export default {
        name: 'EnergyMenuUseEnergyWindow',
        components: {
            CardPopup
        },
        data() {
            return {
                energyStore: useEnergyStore(),
                productionStore: useProductionStore(),
                maxAmount: 0 as number,
                type: this.$t("energy.useEnergy"),
                energyConsumption: {
                    id: '',
                    startIndex: 0 as number,
                    endIndex: 0 as number,
                    amount: 0 as number,
                    price: 0,
                    equipment: {
                        id: '0',
                        energy_class: '',
                        type: useEnergyStore().batteryDischargeEquipmentType,
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
                            maxConsumption: useEnergyStore().getMaxDischargeRate
                        },
                    } as Equipment,
                } as Consumption
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickedConsumeEnergy=false;
            },
            saveEnergyUse(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                if(this.energyStore.canUserUseEnergyAmountOverPeriod(save.startIndex, save.endIndex, save.amount) == false) {
                    alert("You can't use more energy than you have stored");
                } else {
                    this.energyStore.clickedConsumeEnergy=false;
                    this.energyConsumption.startIndex = save.startIndex;
                    this.energyConsumption.endIndex = save.endIndex;
                    this.energyConsumption.amount = save.amount;
                    this.energyConsumption.price = save.price;
                    this.energyStore.consumeEnergy(this.energyConsumption);
                    this.productionStore.addToAddedProductionList(this.energyConsumption);
                }
            },
            amountError() {
                alert(this.$t('error.amountErrorHigherThanEnergyStored'));
            },
            timeError() {
                alert(this.$t('error.timeError'));
            }
        },
        mounted() {
            this.energyConsumption.equipment.id = generateStringId();
            this.energyConsumption.id = generateStringId();
        }
    }
</script>
