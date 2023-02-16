<script setup lang="ts">
    import { useEnergyStore } from '../stores/EnergyStore';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
    import { Equipment } from '../types/Equipment';
    import CardPopupHeader from './CardPopupHeader.vue';
    import CardPopupContent from './CardPopupContent.vue';
    import CardPopupAmountModifier from './CardPopupAmountModifier.vue';
    import CardPopupTimeModifier from './CardPopupTimeModifier.vue';
    import CardPopupSaveButtons from './CardPopupSaveButtons.vue';
</script>


<template>
    <section class="popup-window">
        <div class="color-banner" :style="{backgroundColor: equipment.type.color}"></div>

        <div class="card">
            <CardPopupHeader 
            :equipment-icon="equipment.type.icon_name"
            :equipment-color="equipment.type.color"
            :consumption-type="type"
            @close-popup="closePopup"/>
            <CardPopupContent
            :consumption-amount="amount"
            :equipment-price="price"
            :times="{timeStart:startHour, timeEnd:endHour}"
            :is-cost="false"/>
            <CardPopupAmountModifier
            :amount="amount"
            :max-amount="maxAmount"
            :min-amount="equipment.equipmentConsumptionParams.minConsumption"
            :step-amount="equipment.equipmentConsumptionParams.step"
            @amount="(value) => updateConsumptionAmount(value)"/>
            
        </div>
    </section>

</template>


<script lang="ts">
    export default {
        name: "SaleEnergyWindow", 
        components: {
            CardPopupHeader,
            CardPopupContent,
            CardPopupAmountModifier,
            CardPopupTimeModifier,
            CardPopupSaveButtons,
        }, 
        data() {
            return {
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                type: this.$t("market.saleConsumption"),
                inputError: false as boolean,
                startHour: '00:00' as string,
                endHour: '00:15' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                maxAmount: 10 as number,
                amount: 0 as number,
                price: 0,
                equipment: {
                    id: '0',
                    energy_class: '',
                    type:{
                        id:'energySale',
                        names:[
                            {lang:'fr',name:"vendre de l'énergie"},
                            {lang:'en',name:'energy sold'}
                        ],
                        icon_name:'mdi:home-currency-usd',
                        color: '#002552',
                        isBattery: false,
                        equipmentTypeDurationParams:{
                            isDurationEditable: true,
                            originalDuration: "00:15",
                            step: "00:15",
                            minDuration: "00:15",
                            maxDuration: "23:45"
                        }
                    },
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
                        maxConsumption: 3000
                    },
                } as Equipment,
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickOnSaleMarket();
            },
            updateConsumptionAmount(newConsumption:number) {
                this.amount=newConsumption;
            },

        }
    }
</script>


<style scoped lang="scss">

</style>