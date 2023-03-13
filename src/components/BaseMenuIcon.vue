<script setup lang="ts">
    import { Icon } from '@iconify/vue';
</script>

<template>
    <section :id="menuIconId" class="icon-section"  v-if="isDisplayed">
        <div :class="`${className}-amount amount`" v-if="hasAmount">
            <p>{{ amount }}</p>
        </div>
        <div :class="`${className}-icon-container icon-container`">
            <div :class="`${className}-icon-background icon-background`" @click="clickOnIcon">
                <Icon :icon="iconString" :class="`${className}-icon-image icon-image`" />    
            </div>   
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        name: "MarketMenuIcon",
        components: {
            Icon
        },
        props: {
            menuIconId: {
                type: String,
                required: true
            },
            className: {
                type: String,
                required: true
            },
            iconString: {
                type: String,
                required: true
            },
            hasAmount: {
                type: Boolean,
                required: true
            },
            amount: {
                type: String,
                required: false
            },
            isDisplayed: {
                type: Boolean,
                required: true
            },
        },
        methods: {
            clickOnIcon() {
                this.$emit("click");
            }
        },
        emits: ["click"]
    }
</script>
