<template>
  <div id="app">
    <router-view :key="$route.path" />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: lightblue;
}
.container {
  max-width: 800px;
  margin: auto;
  position: relative;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
  background-color: lightgray;
}
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
