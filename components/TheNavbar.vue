<script setup>
import { inject } from 'vue'
import { Menu } from 'lucide-vue-next'

const isLoginOpen = inject('isLoginOpen')
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-40 bg-brand-light/90 backdrop-blur-sm py-4 transition-all duration-300">
    <div class="container mx-auto px-6 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-brand-red rounded-bl-lg rounded-tr-lg flex items-center justify-center text-white font-bold font-display">
          U
        </div>
        <span class="font-display font-bold text-xl tracking-wide text-brand-dark">UFFIZI</span>
      </div>

      <div class="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
        <a href="#" class="hover:text-brand-red transition-colors">MASCULINO</a>
        <a href="#" class="hover:text-brand-red transition-colors">FEMININO</a>
        <a href="#" class="hover:text-brand-red transition-colors">SOBRE</a>
        <a href="#" class="hover:text-brand-red transition-colors">CONTATO</a>
      </div>

      <div class="flex items-center gap-4">
        <button class="md:hidden text-brand-dark">
          <Menu class="w-6 h-6" />
        </button>
        <button 
          @click="isLoginOpen.value = true"
          class="hidden md:block px-6 py-2 bg-brand-red text-white text-sm font-semibold rounded-full hover:bg-brand-bright transition-all shadow-lg shadow-brand-red/30"
        >
          LOGIN
        </button>
      </div>
    </div>
  </nav>
</template>