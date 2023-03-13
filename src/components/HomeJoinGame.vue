<template>
    <section class="home-join-game section">
        <div class="section-title">
            <h1>{{ $t("home.joinGame") }}</h1>
        </div>
        <p class="description">
            {{ $t("home.joinGameDescription") }}
        </p>
        <div class="input-container">
            <label for="game-id" class="label">{{ $t("home.gameCode") }}</label>
            <input type="text" class="input" id="game-id" v-model="gameId" placeholder="D78UN"/>
        </div>
        <div class="btn-container">
            <button class="btn join-game-btn" @click="joinGame">
                {{ $t("button.join") }}
            </button>
        </div>
    </section>
</template>

<script lang="ts">
import router from '../modules/router';

    export default {
        name: "HomeJoinGame",
        data() {
            return {
                gameParametersStore: useGameParametersStore(),
                multiplayerStore: useMultiplayerStore(),
                gameId: ""
            };
        },
        methods: {
            joinGame() {
                if(this.gameId.length !== 5) {
                    alert(this.$t("home.invalidGameCode"));
                    return;
                }
                this.multiplayerStore.createConnection();
                this.multiplayerStore.joinGame(this.gameId.toLowerCase()) ? router.push("/setup") : alert(this.$t("home.unSuccessfulGameJoin"));
            }
        }
    }
</script>