<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useBoardStore } from '../stores/BoardStore';
import { useEnergyStore } from '../stores/EnergyStore';
import { useConsumptionStore } from '../stores/ConsumptionStore';
import { useEquipmentStore } from '../stores/EquipmentStore';
import CardPopupContent from './CardPopupContent.vue';
import CardPopupHeader from './CardPopupHeader.vue';
import CardPopupTimeModifier from './CardPopupTimeModifier.vue';
import CardPopupModificationButtons from './CardPopupModificationButtons.vue';
import CardPopupSaveButtons from './CardPopupSaveButtons.vue';
import CardPopupAmountModifier from './CardPopupAmountModifier.vue';
</script>

<template>
    <section id="board-consumption-details" class="popup-window">
        <div class="color-banner" :style="{'background-color':consumption.equipment.type.color}"/>
        <div class="card">
            <CardPopupHeader
                :equipment-icon="consumption.equipment.type.icon_name"
                :consumption-type="consumptionType"
                :equipment-color="consumption.equipment.type.color"
                @close-popup="closeDetails"/>
            <CardPopupContent
                :consumption-amount="consumption.amount"
                :equipment-price="consumption.price"
                :times="useConsumptionStore().convertIndexesToTimes(consumption.startIndex, consumption.endIndex)"
                :is-cost="consumption.equipment.equipmentCostParams.hasCost"/>
            <CardPopupModificationButtons
                v-if="!modify && canModify"
                @modify="modifyConsumption"
                @delete="deleteConsumption"/>
            <CardPopupAmountModifier
                v-if="modify && canModifyConsumption"
                :amount="consumption.amount"
                :max-amount="maxConsumptionAmount"
                :min-amount="consumption.equipment.equipmentConsumptionParams.minConsumption"
                :step-amount="consumption.equipment.equipmentConsumptionParams.step"
                i18nKey="input.consumption"
                @amount="(value) => consumption.amount = value"/>
            <CardPopupAmountModifier
                v-if="modify && canModifyCost"
                :amount="consumption.price"
                :max-amount="consumption.equipment.equipmentCostParams.maxCost"
                :min-amount="consumption.equipment.equipmentCostParams.minCost"
                :step-amount="consumption.equipment.equipmentCostParams.step"
                i18n-key="input.cost"
                @amount="(value) => consumption.price = value"/>
            <CardPopupTimeModifier
                v-if="modify && canModifyDuration"
                :start-hour="startHour"
                :end-hour="endHour"
                :max-duration="consumption.equipment.type.equipmentTypeDurationParams.maxDuration"
                :min-duration="consumption.equipment.type.equipmentTypeDurationParams.minDuration"
                :step-duration="consumption.equipment.type.equipmentTypeDurationParams.step"
                :original-duration="consumption.equipment.type.equipmentTypeDurationParams.originalDuration"
                :is-duration-length-editable="consumption.equipment.type.equipmentTypeDurationParams.isDurationLengthEditable"
                :input-error="inputError"
                @start-hour="(value) => updateStartHour(value)"
                @end-hour="(value) => updateEndHour(value)"/>
            <CardPopupSaveButtons
                v-if="modify"
                @save="saveModifiedConsumption"
                @cancel="modify = false"/>
        </div>
    </section>
</template>

<style lang="scss">
    @import '../styles/components/boardConsumptionDetails.scss';
</style>

<script lang="ts">
    const boardStore = useBoardStore();
    const equipmentStore = useEquipmentStore();
    const consumptionStore = useConsumptionStore();
    export default {
        name: 'BoardConsumptionDetails',
        props: {
            consumption: {} as any
        },
        components: {
            Icon,
            CardPopupHeader,
            CardPopupContent,
            CardPopupTimeModifier,
            CardPopupAmountModifier
        },
        data() {
            return {
                energyStore: useEnergyStore(),
                consumptionType: '' as string,
                modify: false as boolean,
                canModify: true as boolean,
                canModifyConsumption: false as boolean,
                canModifyDuration: true as boolean,
                canModifyCost: false as boolean,
                maxConsumptionAmount: 0 as number,
                startHour: '' as string,
                endHour: '' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                inputError: false as boolean,
            };
        },
        methods: {
            closeDetails() {
                boardStore.setClickedTile(null);
            },
            modifyConsumption() {
                this.modify = true;
            },
            updateStartHour(newStartHour:string) {
                this.startHour=newStartHour;
                this.setStartAndEndIndex();
                this.updateMaxConsumptionAmount();
            },
            updateEndHour(newEndHour:string) {
                this.endHour=newEndHour;
                this.setStartAndEndIndex();
                this.updateMaxConsumptionAmount();
            },
            setStartAndEndIndex() {
                const indexes = consumptionStore.convertTimesToIndexes(this.startHour, this.endHour);
                this.startIndex = indexes.indexStart;
                this.endIndex = indexes.indexEnd;
            },
            initializeStartAndEndHour() {
                const hours = consumptionStore.convertIndexesToTimes(this.consumption.startIndex, this.consumption.endIndex);
                this.startHour = hours.timeStart;
                this.endHour = hours.timeEnd;
            },
            saveModifiedConsumption() {
                this.setStartAndEndIndex();
                if(this.startHour === '' || this.endHour === '') {
                    this.inputError = true;
                    return;
                }
                if(this.startIndex > this.endIndex) {
                    this.inputError = true;
                    return;
                }
                if(!this.checkAmountIsUnderMax()) {
                    this.inputError = true;
                    return;
                }
                boardStore.modifyClickedTileConsumptionHours(this.startHour, this.endHour);
                this.modify = false;
                this.inputError = false;
            },
            deleteConsumption() {
                boardStore.deleteClickedTileConsumption();
            },
            updateMaxConsumptionAmount() {
                if(!this.consumption.equipment.type.isBattery) {
                    this.maxConsumptionAmount = this.consumption.equipment.equipmentConsumptionParams.maxConsumption;
                } else {
                    this.energyStore.setValuesFromStoredEnergyList();
                    this.maxConsumptionAmount = this.energyStore.getMaximumEnergyStorageWithoutConsumption(this.consumption.id)/((this.endIndex-this.startIndex)+1)
                }
            },
            checkAmountIsUnderMax() {
                if(this.consumption.amount>this.maxConsumptionAmount) {
                    return false;
                } else {
                    return true;
                }
            },
        },
        watch: {
            consumption: {
                handler() {
                    this.consumptionType = equipmentStore.convertEquipmentToEquipmentLocale(this.consumption.equipment).type.name;
                    const hours = consumptionStore.convertIndexesToTimes(this.consumption.startIndex, this.consumption.endIndex);
                    this.startHour = hours.timeStart;
                    this.endHour = hours.timeEnd;
                },
                immediate: true
            }
        },
        mounted() {
            this.canModifyConsumption = this.consumption.equipment.equipmentConsumptionParams.isConsumptionEditable;
            this.canModifyDuration = this.consumption.equipment.type.equipmentTypeDurationParams.isDurationEditable;
            this.canModifyCost = this.consumption.equipment.equipmentCostParams.isCostEditable;
            this.canModify = this.canModifyConsumption || this.canModifyDuration || this.canModifyCost;
            this.initializeStartAndEndHour();
            this.setStartAndEndIndex();
            this.updateMaxConsumptionAmount();
        }
    };
</script>
