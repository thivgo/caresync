<script setup>
import { X, Github, Facebook } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      
      <!-- Backdrop: heavily blurred dark overlay -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

      <!-- Modal Content -->
      <div class="relative w-full max-w-md mx-4 p-8 rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all transform scale-100">
        
        <!-- Glass Effect Background: White/Transparent mix -->
        <div class="absolute inset-0 bg-white/10 backdrop-blur-2xl z-0"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-black/40 z-0 pointer-events-none"></div>

        <div class="relative z-10 text-white">
          <div class="flex justify-between items-start mb-8">
             <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-red font-bold text-2xl font-display shadow-lg">
               U
             </div>
             <button @click="$emit('close')" class="p-1 rounded-full hover:bg-white/10 transition-colors">
               <X class="w-6 h-6" />
             </button>
          </div>

          <h2 class="text-3xl font-bold mb-1">Login</h2>
          <p class="text-white/80 text-sm mb-6">Bem vindo de volta!</p>

          <form class="space-y-4" @submit.prevent>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-1 ml-1 text-white/90">Email</label>
              <input 
                type="email" 
                placeholder="username@gmail.com" 
                class="w-full bg-white/90 backdrop-blur-sm text-brand-dark placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red border-none shadow-inner transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-1 ml-1 text-white/90">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                class="w-full bg-white/90 backdrop-blur-sm text-brand-dark placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red border-none shadow-inner transition-all"
              />
            </div>

            <div class="flex justify-end">
              <a href="#" class="text-xs text-white/90 hover:text-white underline decoration-white/30">Esqueceu sua senha?</a>
            </div>

            <button class="w-full bg-brand-red hover:bg-brand-bright text-white font-bold py-3.5 rounded-xl shadow-lg shadow-black/30 transform active:scale-95 transition-all mt-2">
              Login
            </button>
          </form>

          <div class="mt-8 flex items-center gap-4">
             <div class="h-px bg-white/20 flex-1"></div>
             <span class="text-xs text-white/60">ou entre com</span>
             <div class="h-px bg-white/20 flex-1"></div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-6">
            <button class="bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors">
              <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-black text-[10px] font-bold">G</div>
              <span class="text-sm font-medium">Google</span>
            </button>
            <button class="bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors">
              <Github class="w-4 h-4" />
              <span class="text-sm font-medium">Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .relative,
.fade-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from .relative,
.fade-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>