<script setup lang="ts">
    import { useBoardStore } from '../stores/BoardStore';
    import { useEnergyStore } from '../stores/EnergyStore';
    import { useEquipmentStore } from '../stores/EquipmentStore';
    import CardPopup from './CardPopup.vue';
</script>

<template>
    <CardPopup
        :id="consumption.id"
        :type="consumptionType"
        :props-amount="consumption.amount"
        :props-max-energy-amount="maxConsumptionAmount"
        :props-price="consumption.price"
        :equipment="consumption.equipment"
        :indexes="{start:startIndex,end:endIndex}"
        :props-is-initial-add-popup="false"
        @close-popup="closeDetails"
        @save="saveModifiedConsumption"
        @cancel="closeDetails"
        @delete="deleteConsumption"/>
</template>

<style lang="scss">
    @import '../styles/components/boardConsumptionDetails.scss';
</style>

<script lang="ts">
    const boardStore = useBoardStore();
    const equipmentStore = useEquipmentStore();
    export default {
        name: 'BoardConsumptionDetailsWindow',
        props: {
            consumption: {} as any
        },
        components: {
            CardPopup
        },
        data() {
            return {
                energyStore: useEnergyStore(),
                consumptionType: '' as string,
                maxConsumptionAmount: 0 as number,
                startIndex: 0 as number,
                endIndex: 0 as number,
            };
        },
        methods: {
            closeDetails() {
                boardStore.setClickedTile(null);
            },
            saveModifiedConsumption(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                this.consumption.amount = save.amount;
                this.consumption.price = save.price;
                this.consumption.startIndex = save.startIndex;
                this.consumption.endIndex = save.endIndex;
                boardStore.modifyClickedTileConsumptionHours(save.startHour, save.endHour);
            },
            deleteConsumption() {
                boardStore.deleteClickedTileConsumption();
            },
        },
        watch: {
            consumption: {
                handler() {
                    this.consumptionType = equipmentStore.convertEquipmentToEquipmentLocale(this.consumption.equipment).type.name;
                },
                immediate: true
            }
        }
    };
</script>