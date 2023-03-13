<script setup lang="ts">
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
        :indexes="{start:consumption.startIndex,end:consumption.endIndex}"
        :props-is-initial-add-popup="false"
        @close-popup="closeDetails"
        @save="saveModifiedConsumption"
        @cancel="closeDetails"
        @delete="deleteConsumption"
        @amount-error="amountError"
        @time-error="timeError"/>
</template>

<script lang="ts">
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
                boardStore: useBoardStore(),
                equipmentStore: useEquipmentStore(),
                consumptionType: '' as string,
                maxConsumptionAmount: 0 as number,
                originalConsumptionAmount: ref(this.consumption.amount),
                originalIndexes: ref({start: this.consumption.startIndex, end: this.consumption.endIndex})
            };
        },
        methods: {
            closeDetails() {
                this.boardStore.setClickedTileToEmpty();
                this.boardStore.setClickedProductionTileToEmpty();
            },
            saveModifiedConsumption(save:{startIndex:number, endIndex:number,amount:number,price:number,startHour:string,endHour:string}) {
                if(this.consumption.equipment.type.isBattery){
                    if(this.consumption.equipment.type.isCharging) {
                        this.boardStore.modifyClickedTileConsumptionHours(save.startHour, save.endHour);
                        this.consumption.amount = this.originalConsumptionAmount;
                        this.consumption.startIndex = this.originalIndexes.start;
                        this.consumption.endIndex = this.originalIndexes.end;
                        this.energyStore.modifyStoredEnergy(this.consumption, save.startIndex, save.endIndex, save.amount);
                    } else {
                        this.boardStore.modifyClickedProductionTile(save.startHour, save.endHour, save.amount);
                        this.consumption.amount = this.originalConsumptionAmount;
                        this.consumption.startIndex = this.originalIndexes.start;
                        this.consumption.endIndex = this.originalIndexes.end;
                        this.energyStore.modifyUsedEnergy(this.consumption, save.startIndex, save.endIndex, save.amount);
                    }
                } else {
                    this.boardStore.modifyClickedTileConsumptionHours(save.startHour, save.endHour);
                }
            },
            deleteConsumption() {
                if(this.consumption.equipment.type.isBattery && this.consumption.equipment.type.isCharging) {
                    if(this.energyStore.canUserRemoveEnergyFromAvailableStoredEnergyList(this.consumption)) {
                        this.boardStore.deleteClickedTileConsumption();
                    } else {
                        alert(this.$t('energy.cannotRemoveStoredEnergyUsed'));
                    }
                } else if(this.consumption.equipment.type.isBattery && !this.consumption.equipment.type.isCharging){
                    this.boardStore.deleteClickedProductionTileConsumption();
                    this.energyStore.removeUsedEnergy(this.consumption);
                } else {
                    this.boardStore.deleteClickedTileConsumption();
                }
            },
            amountError() {
                alert(this.$t('error.consumptionAmountHigherThanMax'));
            },
            timeError() {
                alert(this.$t('error.timeError'));
            }
        },
        watch: {
            consumption: {
                handler() {
                    this.consumptionType = this.equipmentStore.convertEquipmentToEquipmentLocale(this.consumption.equipment).type.name;
                },
                immediate: true
            }
        }
    };
</script>
