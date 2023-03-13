<script setup lang="ts">
    import BaseMenuIcon from './BaseMenuIcon.vue';
</script>

<template>
    <BaseMenuIcon
        :menuIconId="'market-menu-icon'"
        :className="'market'"
        :iconString="'mdi:home-currency-usd'"
        :hasAmount="false"
        :isDisplayed="energyStore.displayMarketIcon"
        @click="energyStore.clickOnMarketIcon()"/>
</template>

<script lang="ts">
    export default {
        name: "MarketMenuIcon",
        components: {
            BaseMenuIcon
        },
        data() {
            return {
                energyStore: useEnergyStore()
            }
        }
    }
</script>
