<template>
  <div class="main">
    <h1>MultiMinesweeper</h1>
    <p>
      Bienvenue sur notre jeu de démineur en ligne !
      <br>
      Pour jouer, il vous suffit de sélectionner le mode de jeu que vous souhaitez dans le menu ci-dessous.
    </p>
    <div class="buttons">
      <router-link to="/game/solo" v-slot="{ navigate }">
        <button @click="navigate">Solo</button>
      </router-link>
      <router-link to="/game/party" v-slot="{ navigate }">
        <button @click="navigate">Multijoueur</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
* {
    text-align: center;
}

.buttons {
    display: flex;
    gap: 10px;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 20px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 150px;
}

button:hover {
    transform: scale(1.1);
    background-color: #555;
}
</style>