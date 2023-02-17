<script setup lang="ts">
    import { useEquipmentStore } from '../stores/EquipmentStore';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
    import { Icon } from '@iconify/vue';
    import CardPopupHeader from './CardPopupHeader.vue';
    import CardPopupContent from './CardPopupContent.vue';
    import CardPopupTimeModifier from './CardPopupTimeModifier.vue';
    import CardPopupSaveButtons from './CardPopupSaveButtons.vue';
import CardPopupAmountModifier from './CardPopupAmountModifier.vue';
</script>

<template>
    <section id="board-consumption-add" class="popup-window">
        <div class="color-banner" :style="{'background-color':equipment.type.color}"/>
        <div class="card">
            <CardPopupHeader
                :equipment-icon="equipment.type.icon_name"
                :consumption-type="equipmentType"
                :equipment-color="equipment.type.color"
                @close-popup="closeAddPopup"/>
            <CardPopupContent 
                :consumption-amount="consumption"
                :equipment-price="price"
                :times="{timeStart:startHour,timeEnd:endHour}"
                :is-cost="equipment.equipmentCostParams.hasCost"/>
            <CardPopupAmountModifier
                v-if="canModifyConsumption"
                :amount="consumption"
                :max-amount="equipment.equipmentConsumptionParams.maxConsumption"
                :min-amount="equipment.equipmentConsumptionParams.minConsumption"
                :step-amount="equipment.equipmentConsumptionParams.step"
                i18n-key="input.consumption"
                @amount="(value) => consumption = value"/>
            <CardPopupAmountModifier
                v-if="canModifyCost"
                :amount="price"
                :max-amount="equipment.equipmentCostParams.maxCost"
                :min-amount="equipment.equipmentCostParams.minCost"
                :step-amount="equipment.equipmentCostParams.step"
                i18n-key="input.cost"
                @amount="(value) => price = value"/>
            <CardPopupTimeModifier
                v-if="canModifyDuration"
                :start-hour="startHour"
                :end-hour="endHour"
                :max-duration="equipment.type.equipmentTypeDurationParams.maxDuration"
                :min-duration="equipment.type.equipmentTypeDurationParams.minDuration"
                :step-duration="equipment.type.equipmentTypeDurationParams.step"
                :original-duration="equipment.type.equipmentTypeDurationParams.originalDuration"
                :is-duration-length-editable="equipment.type.equipmentTypeDurationParams.isDurationLengthEditable"
                :input-error="inputError"
                @start-hour="(value) => setStartHour(value)"
                @end-hour="(value) => setEndHour(value)"/>
            <CardPopupSaveButtons
                @save="saveConsumption"
                @cancel="closeAddPopup"/>
        </div>
    </section>
</template>

<style scoped lang="scss">
    @import "../styles/components/addConsumptionWindows.scss";
</style>

<script lang="ts">
    const equipmentStore = useEquipmentStore();
    const consumptionStore = useConsumptionStore();
    export default {
        name: "AddConsumptionWindow",
        components: {
            Icon,
            CardPopupHeader,
            CardPopupContent,
            CardPopupAmountModifier
        },
        props: {
            equipment: {} as any
        },
        data() {
            return {
                equipmentType: '' as string,
                canModifyConsumption: false as boolean,
                canModifyDuration: true as boolean,
                canModifyCost: false as boolean,
                startHour: '00:00' as string,
                endHour: '23:45' as string,
                startIndex: 0 as number,
                endIndex: 0 as number,
                consumption: 0 as number,
                price: 0 as number,
                inputError: false as boolean
            }
        },
        methods: {
            closeAddPopup() {
                equipmentStore.clickedEquipment = null;
            },
            setStartHour(hour: string) {
                this.startHour = hour;
            },
            setEndHour(hour: string) {
                this.endHour = hour;
            },
            setStartAndEndIndex() {
                const indexes = consumptionStore.convertTimesToIndexes(this.startHour, this.endHour);
                this.startIndex = indexes.indexStart;
                this.endIndex = indexes.indexEnd;
            },
            saveConsumption() {
                this.setStartAndEndIndex();
                if(consumptionStore.checkTimeInput(this.startHour, this.endHour)) {
                    consumptionStore.addConsumption(
                        this.startIndex, this.endIndex, this.equipment, this.consumption, this.price
                    );
                    equipmentStore.clickedEquipment = null;
                    this.inputError = false;
                } else {
                    this.inputError = true;
                }
            }
        },
        watch: {
            equipment: {
                handler: function (equipment: any) {
                    this.equipmentType = equipmentStore.convertEquipmentToEquipmentLocale(equipment).type.name;
                },
                immediate: true
            }
        },
        mounted() {
            this.consumption = this.equipment.equipmentConsumptionParams.originalConsumption;
            this.price = this.equipment.equipmentCostParams.originalPrice;
            this.canModifyConsumption = this.equipment.equipmentConsumptionParams.isConsumptionEditable;
            this.canModifyDuration = this.equipment.type.equipmentTypeDurationParams.isDurationEditable;
            this.canModifyCost = this.equipment.equipmentCostParams.isCostEditable;
        }
    }
</script>
