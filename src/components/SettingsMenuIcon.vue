<script setup lang="ts">
    import BaseMenuIcon from './BaseMenuIcon.vue';
</script>

<template>
    <BaseMenuIcon
        :menuIconId="'settings-menu-icon'"
        :className="'settings'"
        :iconString="'mdi:settings'"
        :hasAmount="false"
        :isDisplayed="true"
        @click=""/>
</template>

<script lang="ts">
    export default {
        name: "SettingsMenuIcon",
        components: {
            BaseMenuIcon
        },
    }
</script>
