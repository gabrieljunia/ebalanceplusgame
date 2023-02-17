<script setup lang="ts">
    import { useEquipmentStore } from '../stores/EquipmentStore';
    import { Equipment } from '../types/Equipment';

    const {equipment} = defineProps<{
        equipment: Equipment;
    }>()

    const store = useEquipmentStore();
    store.getEquipmentData();


    function isClicked(equipment:Equipment) {
        store.setClickedEquipment(equipment);
    }

</script>

<template>
    <div class="equi-container" @click="isClicked(equipment)">
        <div class="conso-class " :class="equipment.energy_class">{{ equipment.energy_class }}</div>
        <h1 class="name">{{ equipment.equipmentConsumptionParams.originalConsumption }} W</h1>
        <p class="price">{{ equipment.equipmentCostParams.originalPrice }} €</p>
    </div>

</template>

<style scoped lang="scss">
    @import "../styles/components/equipments.scss";
</style>