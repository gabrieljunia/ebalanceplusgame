<script setup lang="ts">
import ResultsSituationDisplay from '../components/ResultsSituationDisplay.vue';

    useResultsStore().setFinalSituationPerformanceIndicators();
</script>

<template>
    <div id="results-page" class="view">
        <div class="results-situations-container">
            <ResultsSituationDisplay
                situationNameI18nKey="results.situations.initialSituation.name"
                situationDescriptionI18nKey="results.situations.initialSituation.description"
                :is-initial-situation="true"
                :performanceIndicators="resultsStore.getInitialSituationPerformanceIndicators"/>
            <ResultsSituationDisplay
                situationNameI18nKey="results.situations.finalSituation.name"
                situationDescriptionI18nKey="results.situations.finalSituation.description"
                :is-initial-situation="false"
                :performanceIndicators="resultsStore.getFinalSituationPerformanceIndicators"
                :initialPerformanceIndicators="resultsStore.getInitialSituationPerformanceIndicators"/>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../styles/views/results.scss";
</style>

<script lang="ts">
    export default {
    name: "Results",
    components: { ResultsSituationDisplay },
    data() {
        return {
            resultsStore: useResultsStore(),
        };
    },
}
</script>
