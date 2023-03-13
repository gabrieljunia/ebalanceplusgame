<script setup lang="ts">
    import BaseMenuIcon from './BaseMenuIcon.vue';
</script>

<template>
    <BaseMenuIcon
        :menuIconId="'money-menu-icon'"
        :className="'money'"
        :iconString="moneyStore.getMoneyCurrencyIcon"
        :hasAmount="true"
        :amount="moneyStore.getMoneyAmountToDisplay + ' ' + moneyStore.getMoneyCurrency"
        :isDisplayed="moneyStore.displayMoneyIcon"/>
</template>

<script lang="ts">
    export default {
        name: "MoneyMenuIcon",
        components: {
            BaseMenuIcon
        },
        data() {
            return {
                moneyStore: useMoneyStore()
            }
        }
    }
</script>
