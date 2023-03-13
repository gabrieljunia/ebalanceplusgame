<template>
    <section class="home-create-game section">
        <div class="section-title">
            <h1>{{ $t("home.createGame") }}</h1>
        </div>
        <p class="description">
            {{ $t("home.createGameDescription") }}
        </p>
        <div class="multiplayer-toggle">
            <BaseToggleSwitch
                :is-checked-prop="multiPlayer"
                start-label-key="home.singlePlayer"
                end-label-key="home.multiPlayer"
                @change="multiPlayer = $event"/>
        </div>
        <div class="multiplayer-gameId" v-if="multiPlayer">
            <p class="gameId-label">{{ $t("home.gameCode") }} :</p>
            <p class="gameId-display">{{ gameParametersStore.getGameIdUpper }}</p>
        </div>
        <div class="multiplayer-privacy" v-if="multiPlayer">
            <BaseToggleSwitch
                :is-checked-prop="public"
                start-label-key="home.private"
                end-label-key="home.public"
                @change="public = $event"/>
        </div>
        <div class="btn-container">
            <button class="btn create-game-btn" @click="createGame">
                {{ $t("button.create") }}
            </button>
        </div>
    </section>
</template>

<script lang="ts">
import router from '../modules/router';
import BaseToggleSwitch from './BaseToggleSwitch.vue';

    export default {
    name: "HomeCreateGame",
    data() {
        return {
            gameParametersStore: useGameParametersStore(),
            multiplayerStore: useMultiplayerStore(),
            multiPlayer: false,
            public: false
        };
    },
    methods: {
        createGame() {
            this.gameParametersStore.createGame(this.multiPlayer, this.public);
            if(this.multiPlayer){
                this.multiplayerStore.createConnection();
                this.multiplayerStore.createGame(this.gameParametersStore.gameId) ? router.push("/setup") : alert(this.$t("home.unSuccessfulGameCreation"));
            } else {
                router.push("/setup");
            }
        }
    },
    components: { BaseToggleSwitch }
}
</script>
