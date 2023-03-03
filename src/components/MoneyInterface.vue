<script setup lang="ts">
    import { useMoneyStore } from '../stores/MoneyStore';
    // import { useScenarioStore } from '../stores/ScenarioStore';
    const moneyStore = useMoneyStore();
    moneyStore.setInitialMoneyAndPriceOfEnergy();
</script>

<template>
    <div class="money-interface-container">
        <h2 class="money">
           {{ $t("money.personnalMoney") }} : {{ moneyStore.money }} €
        </h2>
    </div>
</template>

<style scoped lang="scss">
    @import "../styles/components/moneyInterface.scss";
</style>