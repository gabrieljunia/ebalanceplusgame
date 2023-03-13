<script setup lang="ts">
    import { Icon } from '@iconify/vue'; 
    import { convertI18nObjectToLocale } from '../helpers/translation';
</script>

<template>
    <div class="recap-container">
        <div class="card-content" v-if="productionStore.clickedProductionCurve">
            <h1 class="name">
                {{ convertI18nObjectToLocale(productionStore.clickedProductionCurve.names, gameParametersStore.language) }}
            </h1>

            <div class="svg-container">
                <img :src="productionStore.clickedProductionCurve.svg" alt="curve">
            </div>

            <div class="icon-container">
                <div class="icon-type-prod" v-if="!isEmpty(productionStore.clickedProductionCurve.solar)">
                    <Icon icon="mdi:solar-power"/>
                </div>
                <div class="icon-type-prod" v-if="!isEmpty(productionStore.clickedProductionCurve.hydro)">
                    <Icon icon="mdi:hydro-power"/>
                </div>
                <div class="icon-type-prod" v-if="!isEmpty(productionStore.clickedProductionCurve.wind)">
                    <Icon icon="mdi:wind-power"/>
                </div>
            </div> 
            <div class="explanation-container">
                <p>{{ convertI18nObjectToLocale(productionStore.clickedProductionCurve.descriptions, gameParametersStore.language) }}</p>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
    @import "../styles/components/setupProductionAndScenarioResume.scss";
</style>

<script lang="ts">
    export default {
        name: "SetupProductionResume",
        data() {
            return {
                productionStore: useProductionStore(),
                gameParametersStore: useGameParametersStore(),
            }
        },
        methods: {
            isEmpty(listProd: number[]) {
                let empty: boolean;
                if(listProd.length == 0)
                    empty = true;
                else
                    empty = false 
                return empty
            }
        },
        components: {
            Icon
        }
    };
</script>
