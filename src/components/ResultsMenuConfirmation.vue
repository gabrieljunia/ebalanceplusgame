<template>
    <section class="results-menu-confirmation" v-if="resultsStore.getIsConfirmationWindowOpen">
        <div class="content">
            <div class="title">
                <h2>{{ $t("results.confirmSeeResults") }}</h2>
            </div>
            <div class="buttons">
                <Router-Link to="/results">
                    <button class="btn" @click="confirm">{{ $t("button.yes") }}</button>
                </Router-Link>
                <button class="btn" @click="closeConfirmation">{{ $t("button.no") }}</button>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    @import "../styles/components/resultsMenuConfirmation.scss";
</style>

<script lang="ts">
    export default {
        name: "ResultsMenuConfirmation",
        data() {
            return {
                resultsStore: useResultsStore()
            }
        },
        methods: {
            confirm() {
                this.resultsStore.closeResultsConfirmationWindow();
                // TODO : add function call to calculate results ?
            },
            closeConfirmation() {
                this.resultsStore.closeResultsConfirmationWindow();
            }
        }
    }
</script>
