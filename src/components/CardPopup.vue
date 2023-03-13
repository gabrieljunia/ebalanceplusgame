<script setup lang="ts">
    import { Equipment } from '../types/Equipment';
    import { useEnergyStore } from '../stores/EnergyStore';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
    import CardPopupHeader from './CardPopupHeader.vue';
    import CardPopupContent from './CardPopupContent.vue';
    import CardPopupSaveButtons from './CardPopupSaveButtons.vue';
    import CardPopupTimeModifier from './CardPopupTimeModifier.vue';
    import CardPopupAmountModifier from './CardPopupAmountModifier.vue';
    import CardPopupModificationButtons from './CardPopupModificationButtons.vue';
    import { convertTimesToIndexes, convertIndexesToTimes, checkTimeInput } from '../helpers/time';
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
                :is-cost="equipment.equipmentCostParams.hasCost"/>
            <CardPopupModificationButtons
                v-if="!modificationParams.clickedModify
                    && modificationParams.canModify
                    && !modificationParams.isInitialAddPopup"
                @modify="modify"
                @delete="deleteConsumption"/>
            <CardPopupAmountModifier
                v-if="modificationParams.clickedModifyOrInitialAdd && modificationParams.canModifyConsumption"
                :amount="amount"
                :max-amount="maxEnergyAmount"
                :min-amount="equipment.equipmentConsumptionParams.minConsumption"
                :step-amount="equipment.equipmentConsumptionParams.step"
                i18n-key="input.consumption"
                @amount="(value) => updateAmount(value)"/>
            <CardPopupAmountModifier
                v-if="modificationParams.clickedModifyOrInitialAdd && modificationParams.canModifyCost"
                :amount="price"
                :max-amount="equipment.equipmentCostParams.maxCost"
                :min-amount="equipment.equipmentCostParams.minCost"
                :step-amount="equipment.equipmentCostParams.step"
                i18n-key="input.cost"
                @amount="(value) => updatePrice(value)"/>
            <CardPopupTimeModifier
                v-if="modificationParams.clickedModifyOrInitialAdd && modificationParams.canModifyDuration"
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
                v-if="modificationParams.clickedModifyOrInitialAdd"
                @save="saveConsumption"
                @cancel="cancel"/>
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        name: "CardPopup",
        components: {
            CardPopupHeader,
            CardPopupContent,
            CardPopupSaveButtons,
            CardPopupTimeModifier,
            CardPopupAmountModifier,
            CardPopupModificationButtons
        },
        props: {
            id: {
                type: String,
                required: true
            },
            equipment: {
                type: Object as () => Equipment,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            propsAmount: {
                type: Number,
                required: true
            },
            propsMaxEnergyAmount: {
                type: Number,
                required: true
            },
            propsPrice: {
                type: Number,
                required: true
            },
            indexes: {
                type: Object as () => {start: number, end: number},
                required: true
            },
            propsIsInitialAddPopup: {
                type: Boolean,
                required: true
            },
        },
        data() {
            return {
                energyStore: useEnergyStore(),
                consumptionStore: useConsumptionStore(),
                amount: 0 as number,
                maxEnergyAmount: 0 as number,
                price: 0 as number,
                startHour: '' as string,
                endHour: '' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                inputError: false as boolean,
                modificationParams: {
                    canModifyConsumption: false as boolean,
                    canModifyDuration: false as boolean,
                    canModifyCost: false as boolean,
                    canModify: false as boolean,
                    clickedModify: false as boolean,
                    isInitialAddPopup: false as boolean,
                    clickedModifyOrInitialAdd: false as boolean
                }
            }
        },
        methods: {
            closePopup() {
                this.$emit('close-popup');
            },
            modify() {
                this.modificationParams.clickedModify = true;
                this.modificationParams.clickedModifyOrInitialAdd = true;
            },
            cancel(){
                if(this.modificationParams.isInitialAddPopup) {
                    this.$emit('close-popup');
                } else {
                    this.modificationParams.clickedModify = false;
                    this.modificationParams.clickedModifyOrInitialAdd = false;
                }
            },
            deleteConsumption() {
                if(this.modificationParams.isInitialAddPopup) {
                    this.$emit('close-popup');
                } else {
                    this.$emit('delete');
                }
            },
            updateAmount(value: number) {
                this.amount=value;
            },
            updatePrice(value: number) {
                this.price=value;
            },
            updateMaxEnergyAmount() {
                if(this.equipment.type.isBattery && this.equipment.type.isCharging) {
                    this.updateMaxEnergyAmountBatteryCharge();
                } else if(this.equipment.type.isBattery && !this.equipment.type.isCharging) {
                    this.updateMaxEnergyAmountBatteryDischarge();
                } else {
                    this.maxEnergyAmount = this.equipment.equipmentConsumptionParams.maxConsumption;
                }
            },
            updateMaxEnergyAmountBatteryCharge() {
                this.energyStore.updateValues();
                let maxEnergyStorage = 0;
                maxEnergyStorage = this.energyStore.getMaximumEnergyStorageWithoutConsumption(this.id)/((this.endIndex-this.startIndex)+1);
                const maxChargeRate = this.equipment.equipmentConsumptionParams.maxConsumption;
                this.maxEnergyAmount = maxEnergyStorage < maxChargeRate ? maxEnergyStorage : maxChargeRate;
            },
            updateMaxEnergyAmountBatteryDischarge() {
                this.energyStore.updateValues();
                let maxUsableEnergy = 0;
                if(this.propsIsInitialAddPopup){
                    maxUsableEnergy = this.energyStore.getMaxAmountOfEnergyUserCanUseOverPeriod(this.startIndex, this.endIndex);
                } else {
                    maxUsableEnergy = this.energyStore.getMaxAmountOfEnergyUserCanUseOverPeriodWithoutConsumption(this.id, this.startIndex, this.endIndex);
                }
                const maxDischargeRate = this.equipment.equipmentConsumptionParams.maxConsumption;
                this.maxEnergyAmount = maxUsableEnergy < maxDischargeRate ? maxUsableEnergy : maxDischargeRate;
            },
            updateStartHour(newStartHour: string) {
                this.startHour=newStartHour;
                this.setStartAndEndIndex();
                this.updateMaxEnergyAmount();
            },
            updateEndHour(newEndHour: string) {
                this.endHour=newEndHour;
                this.setStartAndEndIndex();
                this.updateMaxEnergyAmount();
            },
            setStartAndEndIndex() {
                const indexes = convertTimesToIndexes(this.startHour, this.endHour);
                this.startIndex = indexes.indexStart;
                this.endIndex = indexes.indexEnd;
            },
            initializeStartAndEndHour() {
                const hours = convertIndexesToTimes(this.indexes.start, this.indexes.end);
                this.startHour = hours.timeStart;
                this.endHour = hours.timeEnd;
            },
            checkAmountIsUnderMax() {
                if(this.amount>this.maxEnergyAmount) {
                    return false;
                } else {
                    return true;
                }
            },
            saveConsumption() {
                if(checkTimeInput(this.startHour, this.endHour)){
                    this.inputError = false;
                    if (this.checkAmountIsUnderMax()) {
                        this.$emit('save', {   
                                amount:this.amount,
                                price:this.price,
                                startIndex:this.startIndex,
                                endIndex:this.endIndex,
                                startHour:this.startHour,
                                endHour:this.endHour
                            });
                    } else {
                        this.$emit('amount-error');
                    }
                } else {
                    this.$emit('time-error');
                    this.inputError = true;
                }
            }
        },
        watch: {
            equipment: {
                handler: function (newEquipment) {
                    this.modificationParams.canModifyConsumption = newEquipment.equipmentConsumptionParams.isConsumptionEditable;
                    this.modificationParams.canModifyDuration = newEquipment.type.equipmentTypeDurationParams.isDurationEditable;
                    this.modificationParams.canModifyCost = newEquipment.equipmentCostParams.isCostEditable;
                    this.modificationParams.canModify = this.modificationParams.canModifyConsumption || this.modificationParams.canModifyDuration || this.modificationParams.canModifyCost;
                },
                immediate: true
            },
            propsAmount: {
                handler: function (newAmount) {
                    this.updateAmount(newAmount);
                },
                immediate: true
            },
            propsMaxEnergyAmount: {
                handler: function (newMaxEnergyAmount) {
                    this.updateMaxEnergyAmount();
                },
                immediate: true
            },
            propsPrice: {
                handler: function (newPrice) {
                    this.updatePrice(newPrice);
                },
                immediate: true
            },
            indexes: {
                handler: function (newIndexes) {
                    this.startIndex = ref(newIndexes.start);
                    this.endIndex = ref(newIndexes.end);
                    this.initializeStartAndEndHour();
                    this.setStartAndEndIndex();
                    this.updateMaxEnergyAmount();
                },
                immediate: true
            },
            propsIsInitialAddPopup: {
                handler: function (newIsInitialAddPopup) {
                    this.modificationParams.isInitialAddPopup = newIsInitialAddPopup;
                    this.modificationParams.clickedModifyOrInitialAdd = this.modificationParams.clickedModify || this.modificationParams.isInitialAddPopup;
                },
                immediate: true
            }
        },
        emits : ['close-popup', 'save', 'cancel', 'delete', 'amount-error', 'time-error'],
    }
</script>
