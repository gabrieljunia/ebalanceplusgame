<script setup lang="ts">
    import { Icon } from '@iconify/vue';
</script>

<template>
    <div class="card-content">
        <div class="card-content-price">
            <h2 class="price-amount">
                <Icon :icon="costIcon" class="icon-cost"/>
                {{ price }} 
            </h2>
        </div>
    </div>
</template>


<script lang="ts">
    export default {
        name: "CardPopupCost",
        components: {
            Icon
        },
        props: {
            times : {
                type: Object as () => Times,
                required: true   
            },
            price : {
                type: Number,
                required: true
            },
        },
        data() {
            return {
                moneyStore: useMoneyStore(),
                costIcon: 'mdi:cash-usd' as string,
                indexes: {} as Object 
            }
        }, 
        methods: {
            getIndexFromHours(){
                this.indexes = useConsumptionStore().convertTimesToIndexes(this.times.timeStart, this.times.timeEnd);
            }
        }
    }

    interface Times {
        timeStart: string;
        timeEnd: string;
    }
</script>


<style scoped lang="scss">
    @import '../styles/components/cardPopupCost.scss'
</style>