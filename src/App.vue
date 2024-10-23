<template>
  <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet'>

  <header>
    <h1 class="vc" style="font-family: Roboto Condensed">MultiMinesweeper</h1>
    <div class="vl"></div>
    <h2 class="vc">
        <p>Made by </p>
        <a href="https://github.com/Angels-dev">Zachary</a>
        <p> and </p>
        <a href="https://github.com/betasown">Louis</a>
    </h2>
    <nav class="vc">
        <p>Offline</p>
        <p>|</p>
        <p>Active Players : 2</p>
    </nav>
    <button style="right: 20px" class="vc">Light</button>
  </header>

  <router-view v-slot="{ Component }">
    <transition name="slide-fade" mode="out-in">
        <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped>
header {
    position: fixed;
    z-index: 2;
    height: 40px;
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: #fff;
}

header * {
    display: inline-block;
    vertical-align: middle;
}

h1 {
    text-align: center;
    left: 0;
    width: 200px;
    font-size: 22px;
}

h2 {
    text-align: left;
    left: 220px;
    font-size: medium;
}

nav {
    right: 100px;
    font-size: 20px;
}

nav * {
    margin-left: 20px;
}
</style>
