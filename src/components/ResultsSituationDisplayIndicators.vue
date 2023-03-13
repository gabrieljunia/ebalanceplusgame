<script setup lang="ts">
    import { emptyResultsPerformanceIndicators } from '../assets/entityEmptyResults';
import { ResultsPerformanceIndicators } from '../types/Results';
    import ResultsSituationDisplayIndicatorsIndicator from './ResultsSituationDisplayIndicatorsIndicator.vue';
import ResultsSituationDisplayIndicatorsRate from './ResultsSituationDisplayIndicatorsRate.vue';
</script>

<template>
    <div class="indicators">
        <div class="line"/>
        <div class="indicators-section">
            <h3 class="indicators-section-title">{{ $t("results.sections.consumption") }}</h3>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalConsumption"
                :indicatorValue="performanceIndicators.totalConsumption"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalConsumption"/>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalOverConsumption"
                :indicatorValue="performanceIndicators.totalOverConsumption"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalOverConsumption"/>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalSoldEnergy"
                :indicatorValue="performanceIndicators.totalSoldEnergy"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalSoldEnergy"/>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalStoredEnergy"
                :indicatorValue="performanceIndicators.totalStoredEnergy"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalStoredEnergy"
                :reverse-color-indicators="true"/>
        </div>
        <div class="line"/>
        <div class="indicators-section">
            <h3 class="indicators-section-title">{{ $t("results.sections.production") }}</h3>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalProduction"
                :indicatorValue="performanceIndicators.totalProduction"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalProduction"/>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalBoughtEnergy"
                :indicatorValue="performanceIndicators.totalBoughtEnergy"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalBoughtEnergy"/>
            <ResultsSituationDisplayIndicatorsIndicator
                indicatorNameI18nKey="results.performanceIndicators.totalUsedStoredEnergy"
                :indicatorValue="performanceIndicators.totalUsedStoredEnergy"
                :is-initial-value="isInitialSituation"
                :initial-value="initialPerformanceIndicators.totalUsedStoredEnergy"
                :reverse-color-indicators="true"/>
        </div>
        <div class="line"/>
        <div class="indicators-section">
            <h3 class="indicators-section-title">{{ $t("results.sections.ratios") }}</h3>
            <ResultsSituationDisplayIndicatorsRate
                ratioNameI18nKey="results.performanceIndicators.ratios.selfConsumptionRatio"
                :ratioValue="performanceIndicators.selfConsumptionRatio"
                />
            <ResultsSituationDisplayIndicatorsRate
                ratioNameI18nKey="results.performanceIndicators.ratios.selfProductionRatio"
                :ratioValue="performanceIndicators.selfProductionRatio"
                />
        </div>
    </div>
</template>

<style lang="scss">
    @import "../styles/components/resultsSituationDisplayIndicators.scss";
</style>

<script lang="ts">
    export default {
        name: "ResultsSituationDisplayIndicators",
        components: {
    ResultsSituationDisplayIndicatorsIndicator,
    ResultsSituationDisplayIndicatorsRate
},
        props: {
            performanceIndicators: {
                type: Object as () => ResultsPerformanceIndicators,
                required: true,
            },
            initialPerformanceIndicators: {
                type: Object as () => ResultsPerformanceIndicators,
                required: false,
                default: emptyResultsPerformanceIndicators
            },
            isInitialSituation: {
                type: Boolean,
                required: true,
            },
        }
    }
</script>
