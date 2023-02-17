<script setup lang="ts">
import EnergyIcon from '../components/EnergyIcon.vue';
import EnergyMenu from '../components/EnergyMenu.vue';
import MarketMenu from './MarketMenu.vue';
import { useEnergyStore } from '../stores/EnergyStore';
import { Icon } from '@iconify/vue';
</script>

<template>
    <section id="game-board-snackbar">
        <EnergyMenu v-if="useEnergyStore().clickedEnergyIcon"/>
        <EnergyIcon />
        <div class="market-icon-container">
            <div class="market-icon-background" @click="useEnergyStore().clickOnMarketIcon()" v-if="!useEnergyStore().clickedMarketIcon">
                <Icon icon="mdi:home-currency-usd" class="market-icon-image" />    
            </div>   
        </div>
         
        <MarketMenu />
    </section>
</template>

<style lang="scss">
    @import '../styles/components/gameBoardSnackBar.scss';
</style>
