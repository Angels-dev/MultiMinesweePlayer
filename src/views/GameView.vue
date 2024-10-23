<template>
  <div>
    <div class="sidenav">
      <router-link to="/">Home</router-link>
      <div class="vl"></div>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>