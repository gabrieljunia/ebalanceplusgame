<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { useConsumptionStore } from '../stores/ConsumptionStore';
</script>

<template>
    <div class="card-content">
        <div class="card-content-consumption card-content-item">
            <h2 class="consumption-amount">
                <Icon :icon="flashIcon" class="icon-consumption"/>
                {{ consumptionAmount }} W/15min</h2>
            <h2 class="consumption-amount-Wh">
                {{ $t("button.total") }} : 
                {{ consumptionAmountWh }} W</h2>
        </div>
        <div class="card-content-price card-content-item" v-if="isCost">
            <h2 class="consumption-price">
                <Icon :icon="cashIcon" class="icon-price"/>
                {{ equipmentPrice }} €</h2>
        </div>
        <div class="card-content-time card-content-item">
            <h2 class="consumption-time">
                <Icon :icon="clockIcon" class="icon-time"/>
                {{ times.timeStart }} - {{ times.timeEnd}}</h2>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../styles/components/cardPopupContent.scss';
</style>

<script lang="ts">
    export default {
        name: "CardPopupContent",
        components: {
            Icon
        },
        props: {
            consumptionAmount: {
                type: Number,
                required: true
            },
            equipmentPrice: {
                type: Number,
                required: true
            },
            times : {
                type: Object as () => Times,
                required: true   
            },
            isCost: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                consumptionStore: useConsumptionStore(),
                consumptionAmountWh: 0 as number,
                flashIcon: 'mdi:flash' as string,
                clockIcon: 'mdi:clock' as string,
                cashIcon: 'mdi:cash' as string
            }
        },
        methods: {
            calculateConsumptionAmountWh() {
                const indexes = this.consumptionStore.convertTimesToIndexes(this.times.timeStart, this.times.timeEnd);
                this.consumptionAmountWh = this.consumptionAmount * (indexes.indexEnd - indexes.indexStart+1);
            }
        },
        watch : {
            consumptionAmount: {
                handler: function() {
                    this.calculateConsumptionAmountWh();
                },
                immediate: true
            },
            times: {
                handler: function() {
                    this.calculateConsumptionAmountWh();
                },
                immediate: true
            }
        },
    }
    interface Times {
        timeStart: string;
        timeEnd: string;
}
</script>
