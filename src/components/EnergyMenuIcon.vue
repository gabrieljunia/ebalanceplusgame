<script setup lang="ts">
    import { Icon } from '@iconify/vue';
</script>

<template>
    <section id="energy-menu-icon" class="icon-section"  v-if="energyStore.displayEnergyIcon">
        <div class="energy-amount amount">
            <p>{{ energyStore.storedEnergy }} W</p>
        </div>
        <div class="energy-icon icon-container">
            <div class="energy-icon-background icon-background" @click="energyStore.clickOnEnergyIcon()">
                <Icon :icon="energyStore.getEnergyIcon" class="energy-icon-image icon-image" :style="{'color' : energyStore.getEnergyIconColor}"/>
            </div>
            <span class="energy-icon-batteries" :style="{'padding':energyStore.numberOfBatteries > 9 ? '5px 10px ' : '1px 10px'}">
                {{ energyStore.numberOfBatteries }}
            </span>
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        name: "EnergyMenuIcon",
        components: {
            Icon
        },
        data() {
            return {
                energyStore: useEnergyStore()
            }
        }
    }
</script>
