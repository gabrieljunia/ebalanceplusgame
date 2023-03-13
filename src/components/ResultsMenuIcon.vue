<script setup lang="ts">
    import BaseMenuIcon from './BaseMenuIcon.vue';
</script>

<template>
    <BaseMenuIcon
        :menuIconId="'results-menu-icon'"
        :className="'results'"
        :iconString="resultsStore.getConfirmationButtonIcon"
        :hasAmount="false"
        :isDisplayed="true"
        @click="handleClick"/>
</template>

<script lang="ts">
    export default {
        name: "ResultsMenuIcon",
        components: {
            BaseMenuIcon
        },
        data() {
            return {
                resultsStore: useResultsStore()
            }
        },
        methods: {
            handleClick() {
                if(this.resultsStore.getIsConfirmationWindowOpen) {
                    this.resultsStore.closeResultsConfirmationWindow();
                } else {
                    this.resultsStore.openResultsConfirmationWindow();
                }
            }
        }
    }
</script>
