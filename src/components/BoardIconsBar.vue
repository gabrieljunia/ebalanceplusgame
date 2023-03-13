<script setup lang="ts">
    import EnergyMenu from './EnergyMenu.vue';
    import MarketMenu from './MarketMenu.vue';
    import EnergyMenuIcon from './EnergyMenuIcon.vue';
    import MarketMenuIcon from './MarketMenuIcon.vue';
    import MoneyMenuIcon from './MoneyMenuIcon.vue';
    import ResultsMenuIcon from './ResultsMenuIcon.vue';
    import SettingsMenuIcon from './SettingsMenuIcon.vue';
    import MultiplayerMenuIcon from './MultiplayerMenuIcon.vue';
</script>

<template>
    <section id="game-board-snackbar">
        <MoneyMenuIcon/>
        <MultiplayerMenuIcon/>
        <MarketMenu/>
        <MarketMenuIcon/>
        <EnergyMenu/>
        <EnergyMenuIcon/>
        <SettingsMenuIcon/>
        <ResultsMenuIcon/>
    </section>
</template>

<style lang="scss">
    @import '../styles/components/gameBoardSnackBar.scss';
</style>
