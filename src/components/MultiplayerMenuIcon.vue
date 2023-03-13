<script setup lang="ts">
    import BaseMenuIcon from './BaseMenuIcon.vue';
</script>

<template>
    <BaseMenuIcon
        :menuIconId="'multiplayer-menu-icon'"
        :className="'multiplayer'"
        :iconString="'mdi:account-multiple'"
        :hasAmount="false"
        :isDisplayed="gameParametersStore.isMultiplayer"
        @click=""/>
</template>

<script lang="ts">
    export default {
        name: "MultiplayerMenuIcon",
        components: {
            BaseMenuIcon
        },
        data() {
            return {
                gameParametersStore: useGameParametersStore()
            }
        }
    }
</script>
