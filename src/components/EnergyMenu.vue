<script setup lang="ts">
import { useEnergyStore } from '../stores/EnergyStore';
</script>

<template>
    <section id="menu">
        <div class="menu-header">
            <span class="stored-percentage" :style="{'color' : energyStore.getEnergyIconColor}">
                {{ energyStore.getEnergyStoragePercentage }} %
            </span>
            <h2 class="title">
                {{ $t("energy.header") }}
            </h2>
            <span class="closebtn" @click="energyStore.clickOnEnergyIcon()">&times;</span>
        </div>
        <div class="menu-figures">
            <div class="figure">
                <p class="text">{{ $t("energy.stored") }} :</p>
                <h3 class="text">{{energyStore.storedEnergy}} W</h3>
            </div>
            <div class="figure">
                <p class="text">{{ $t("energy.max") }} :</p>
                <h3 class="text">{{energyStore.maxEnergy}} W</h3>
            </div>
        </div>
        <div class="menu-buttons">
            <button @click="energyStore.clickOnStoreEnergy" class="btn">{{ $t("button.store") }}</button>
            <button @click="energyStore.clickOnConsumeEnergy" class="btn">{{ $t("button.use") }}</button>
        </div>
        <div class="menu-batteries">
            <h3 class="title">{{ $t("energy.batteriesManagement") }}</h3>
            <div class="figures-container">
                <div class="figure">
                    <h4>{{ $t("money.cost") }} :</h4>
                    <p>{{ energyStore.batteryPrice }} €</p>
                </div>
                <div class="figure">
                    <h4>{{ $t("energy.capacity") }} :</h4>
                    <p>{{ energyStore.batteryIndividualCapacity }} W</p>
                </div>
            </div>
            <div class="batteries">
                <button @click="energyStore.removeBattery" class="btn delete" :class="energyStore.numberOfBatteries > 1 ? '':'disabled'">-</button>
                <span>{{ energyStore.numberOfBatteries }}</span>
                <button @click="energyStore.addBattery" class="btn add">+</button>
            </div>
        </div>
        <div class="energy-menu-history">
            <h3></h3>
            <div>
                <!--
                <div v-for="energy in energyStore.storedEnergyList">
                    
                </div>
                -->
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    @import "../styles/components/energyAndMarketMenu.scss";
</style>

<script lang="ts">
    const energyStore = useEnergyStore();
    export default {
        name: "EnergyMenu"
    }
</script>
