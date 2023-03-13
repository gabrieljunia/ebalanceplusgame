<script setup lang="ts">
    import { Icon } from '@iconify/vue';
</script>

<template>
    <div class="card-header">
        <Icon :icon="equipmentIcon" class="icon" :style="{'color':equipmentColor}"/>
        <h1 class="consumption-details-title">{{consumptionType}}</h1>
        <span class="closebtn" @click="$emit('close-popup')">&times;</span>
    </div>
</template>

<style lang="scss">
    @import '../styles/components/cardPopupHeader.scss';
</style>

<script lang="ts">
    export default {
        name: 'CardPopupHeader',
        components: {
            Icon
        },
        props: {
            equipmentIcon: {
                type: String,
                required: true
            },
            equipmentColor: {
                type: String,
                required: true
            },
            consumptionType: {
                type: String,
                required: true
            }
        }
    }
</script>
