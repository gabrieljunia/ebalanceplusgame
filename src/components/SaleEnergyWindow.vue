<script setup lang="ts">
    import { useEnergyStore } from '../stores/EnergyStore';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
    import { Equipment } from '../types/Equipment';
    import CardPopupHeader from './CardPopupHeader.vue';
    import CardPopupContent from './CardPopupContent.vue';
    import CardPopupAmountModifier from './CardPopupAmountModifier.vue';
    import CardPopupTimeModifier from './CardPopupTimeModifier.vue';
    import CardPopupSaveButtons from './CardPopupSaveButtons.vue';
    import CardPopupCost from './CardPopupCost.vue';
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
            :max-amount="equipment.equipmentConsumptionParams.maxConsumption"
            :min-amount="equipment.equipmentConsumptionParams.minConsumption"
            :step-amount="equipment.equipmentConsumptionParams.step"
            @amount="(value) => updateConsumptionAmount(value)" 
            i18n-key="input.consumption"/>
            <CardPopupCost
            :times="{timeStart:startHour, timeEnd: endHour}"
            :price='getPrice()'/>
            <CardPopupTimeModifier
            :start-hour="startHour"
            :end-hour="endHour"
            :max-duration="equipment.type.equipmentTypeDurationParams.maxDuration"
            :min-duration="equipment.type.equipmentTypeDurationParams.minDuration"
            :step-duration="equipment.type.equipmentTypeDurationParams.step"
            :original-duration="equipment.type.equipmentTypeDurationParams.originalDuration"
            :is-duration-length-editable="equipment.type.equipmentTypeDurationParams.isDurationLengthEditable"
            :input-error="inputError"
            @start-hour="(value) => updateStartHour(value)"
            @end-hour="(value) => updateEndHour(value)"/>
            <CardPopupSaveButtons
            @save="saveConsumption"
            @cancel="closePopup"/>
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
            CardPopupCost
        }, 
        data() {
            return {
                moneyStore: useMoneyStore(),
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                type: this.$t("market.saleConsumption"),
                inputError: false as boolean,
                startHour: '00:00' as string,
                endHour: '00:15' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                maxAmount: 3000 as number,
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
                            isDurationLengthEditable: true,
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
                        step: 50,
                        minConsumption: 0,
                        maxConsumption: 3000
                    },
                } as Equipment,
                indexes: {} as Object,
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickOnSaleMarket();
            },
            updateConsumptionAmount(newConsumption:number) {
                this.amount=newConsumption;
            },
            updateStartHour(newStartHour:string) {
                this.startHour=newStartHour;
                this.setStartAndEndIndex();
                this.updateMaxAmount();
            },
            updateEndHour(newEndHour:string) {
                this.endHour=newEndHour;
                this.setStartAndEndIndex();
                this.updateMaxAmount();
            },
            setStartAndEndIndex() {
                const indexes = this.consumptionStore.convertTimesToIndexes(this.startHour, this.endHour);
                this.startIndex = indexes.indexStart;
                this.endIndex = indexes.indexEnd;
            },
            updateMaxAmount() {
                this.maxAmount=(this.energyStore.maxEnergy-this.energyStore.storedEnergy)/((this.endIndex-this.startIndex)+1)
            },
            checkAmountIsUnderMax() {
                if(this.amount>this.maxAmount) {
                    return false;
                } else {
                    return true;
                }
            },
            saveConsumption() {
                if(this.consumptionStore.checkTimeInput(this.startHour, this.endHour)) {
                    this.inputError=false;
                    if (this.checkAmountIsUnderMax()) {
                        this.consumptionStore.addConsumption(this.startIndex, this.endIndex, this.equipment, this.amount, this.price);
                        this.energyStore.clickOnSaleMarket();
                    }
                } else {
                    this.inputError=true;
                }
            },
            getRandomEquipmentIdString() {
                return Math.random().toString(36).substr(2, 9);
            },
            getPrice() {
                this.price = this.moneyStore.getTotalPrice(this.equipment.equipmentConsumptionParams.step, this.amount,this.startIndex, this.endIndex);
                return this.price
            }
        },
        computed : {
            getInitialMonet() {
                this.moneyStore.getInitialMoney;
            }
        },
        mounted() {
            this.updateMaxAmount();
            this.equipment.id=this.getRandomEquipmentIdString();
        }
    }
</script>


<style scoped lang="scss">

</style>