<script setup lang="ts">
    import { useProductionStore } from '../stores/ProductionStore';
    import { ProductionCurve } from '../types/Production';
    import { Icon } from '@iconify/vue';
import { convertI18nObjectToLocale } from '../helpers/translation';
</script>

<template>
    <section class="list-container">
        <div class="boucle" v-for="curve in productionCurves" @click="isClicked(curve)">
            <div class="box-container">
                <h1>{{ convertI18nObjectToLocale(curve.names,gameParametersStore.language) }}</h1>
                <div class="svg-container">
                    <img :src="curve.svg" alt="curve">
                </div>
                <div class="icon-container">
                    <div class="icon-type-prod" v-if="!isEmpty(curve.solar)">
                        <Icon icon="mdi:solar-power" style="color:orange"/>
                    </div>
                    <div class="icon-type-prod" v-if="!isEmpty(curve.hydro)">
                        <Icon icon="mdi:hydro-power" style="color:blue"/>
                    </div>
                    <div class="icon-type-prod" v-if="!isEmpty(curve.wind)">
                        <Icon icon="mdi:wind-power" style="color:darkcyan"/>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped lang="scss">
    @import "../styles/components/setupProductionAndScenarioList.scss";
</style>

<script lang="ts">
    export default {
        name: "SetupProductionList",
        data() {
            return {
                productionStore : useProductionStore(),
                gameParametersStore: useGameParametersStore()
            }
        },
        computed : {
            productionCurves() {
                return this.productionStore.productionCurves.values();
            }
        },
        methods: {
            isClicked(productionCurve: ProductionCurve ) {
                this.productionStore.setClickedProductionCurve(productionCurve);
            },
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
