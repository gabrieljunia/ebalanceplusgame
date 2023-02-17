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
        <div class="color-banner" :style="{'background-color':equipment.type.color}"/>
        <div class="card">
            <CardPopupHeader 
                :equipment-icon="equipment.type.icon_name"
                :equipment-color="equipment.type.color"
                :consumption-type="type"
                @close-popup="closePopup"/>
            <CardPopupContent 
                :consumption-amount="amount"
                :equipment-price="price"
                :times="{timeStart:startHour,timeEnd:endHour}"
                :is-cost="false"/>
            <CardPopupAmountModifier 
                :amount="amount"
                :max-amount="maxAmount"
                :min-amount="equipment.equipmentConsumptionParams.minConsumption"
                :step-amount="equipment.equipmentConsumptionParams.step"
                i18n-key="input.consumption"
                @amount="(value) => updateConsumptionAmount(value)"/>
            <CardPopupAmountModifier
                v-if="equipment.equipmentCostParams.isCostEditable"
                :amount="price"
                :max-amount="equipment.equipmentCostParams.maxCost"
                :min-amount="equipment.equipmentCostParams.minCost"
                :step-amount="equipment.equipmentCostParams.step"
                i18n-key="input.cost"
                @amount="(value) => updatePrice(value)"/>
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
        name: 'EnergyAddEnergyWindow',
        components: {
            CardPopupHeader,
            CardPopupAmountModifier,
            CardPopupTimeModifier
        },
        data() {
            return {
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                type: this.$t("energy.storeEnergy"),
                inputError: false as boolean,
                startHour: '00:15' as string,
                endHour: '00:30' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                maxAmount: 10 as number,
                amount: 0 as number,
                price: 0,
                equipment: {
                    id: '0',
                    energy_class: '',
                    type:{
                        id:'batteryStorage',
                        names:[
                            {lang:'fr',name:"Stocker de l'énergie"},
                            {lang:'en',name:'Store energy'}
                        ],
                        icon_name:'mdi:battery-charging-100',
                        color: 'green',
                        isBattery: true,
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
                        step: 10,
                        minConsumption: 0,
                        maxConsumption: 200
                    },
                } as Equipment,
            }
        },
        methods: {
            closePopup() {
                this.energyStore.clickOnStoreEnergy();
            },
            updateConsumptionAmount(newConsumption:number) {
                this.amount=newConsumption;
            },
            updatePrice(newPrice:number) {
                this.price=newPrice;
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
                        this.energyStore.clickOnStoreEnergy();
                    }
                } else {
                    this.inputError=true;
                }
            },
            getRandomEquipmentIdString() {
                return Math.random().toString(36).substr(2, 9);
            }
        },
        mounted() {
            this.updateMaxAmount();
            this.equipment.id=this.getRandomEquipmentIdString();
        }
    }
</script>
