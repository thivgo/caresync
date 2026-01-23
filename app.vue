<script setup>
import { defineAsyncComponent, ref, provide } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'

// Define state locally
const isLoginOpen = ref(false)

// Provide to all descendants
provide('isLoginOpen', isLoginOpen)

const LoginModal = defineAsyncComponent(() => import('./components/LoginModal.vue'))

const closeLogin = () => {
  isLoginOpen.value = false
}
</script>

<template>
  <div class="font-sans antialiased text-gray-800 bg-brand-light min-h-screen selection:bg-brand-red selection:text-white overflow-x-hidden">
    
    <TheNavbar />
    
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
      
      <TheFooter />
    </main>

    <LoginModal v-if="isLoginOpen" :is-open="isLoginOpen" @close="closeLogin" />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #111;
}
::-webkit-scrollbar-thumb {
  background: #690A0A;
  border-radius: 4px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, filter 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>