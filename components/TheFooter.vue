<script setup>
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-vue-next'
</script>

<template>
  <footer class="relative bg-brand-red pt-10">
    <div class="container mx-auto px-6 pb-32 text-center">
      
      <h3 class="text-white font-display font-bold text-2xl mb-12">Mais sobre</h3>

      <div class="grid md:grid-cols-3 gap-6 mb-20 relative z-10">
        <div class="bg-white rounded-3xl p-8 shadow-xl transform hover:-translate-y-2 transition-transform">
          <h4 class="font-display font-bold text-xl mb-2">Fase Um</h4>
          <span class="text-xs text-gray-400 uppercase tracking-widest mb-4 block">Design & Conceito</span>
          <img src="https://placehold.co/200x200/FFFFFF/690A0A?text=Sketch" class="mx-auto mb-4 h-32 object-contain" alt="Step 1" />
          <p class="text-sm text-gray-500">Desenvolvimento dos croquis e aprovação dos tecidos.</p>
        </div>

        <div class="bg-white rounded-3xl p-8 shadow-xl transform hover:-translate-y-2 transition-transform delay-100">
           <h4 class="font-display font-bold text-xl mb-2">Fase Dois</h4>
           <span class="text-xs text-gray-400 uppercase tracking-widest mb-4 block">Produção</span>
           <img src="https://placehold.co/200x200/FFFFFF/690A0A?text=Sewing" class="mx-auto mb-4 h-32 object-contain" alt="Step 2" />
           <p class="text-sm text-gray-500">Confecção das peças com controle de qualidade rigoroso.</p>
        </div>

        <div class="bg-white rounded-3xl p-8 shadow-xl transform hover:-translate-y-2 transition-transform delay-200">
           <h4 class="font-display font-bold text-xl mb-2">Fase Três</h4>
           <span class="text-xs text-gray-400 uppercase tracking-widest mb-4 block">Entrega</span>
           <img src="https://placehold.co/200x200/FFFFFF/690A0A?text=Delivery" class="mx-auto mb-4 h-32 object-contain" alt="Step 3" />
           <p class="text-sm text-gray-500">Logística integrada e entrega em todo o território nacional.</p>
        </div>
      </div>

      <div class="mb-12">
        <h3 class="text-white font-display font-bold text-xl mb-4">Como comprar?</h3>
        <p class="text-white/80 max-w-2xl mx-auto text-sm">
          Entre em contato com nossos consultores. Desenvolvemos projetos exclusivos para sua empresa.
          Clique no botão abaixo para iniciar seu orçamento.
        </p>
      </div>

    </div>

    <!-- Bottom Dark Section with Clean straight top -->
    <div class="relative w-full bg-brand-dark pt-20 pb-8 mt-12">
       
       <div class="container mx-auto px-6 relative z-20">
         <div class="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
           
           <!-- Logo Section -->
           <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand-red/20 font-display">U</div>
             <span class="text-white font-bold text-xl tracking-wide font-display">UFFIZI</span>
           </div>

           <!-- Navigation Links -->
           <nav class="flex flex-wrap justify-center gap-8 text-xs font-semibold tracking-wider text-gray-400">
             <a href="#" class="hover:text-brand-red transition-colors duration-300">HOME</a>
             <a href="#" class="hover:text-brand-red transition-colors duration-300">PRODUTOS</a>
             <a href="#" class="hover:text-brand-red transition-colors duration-300">CONTATO</a>
             <a href="#" class="hover:text-brand-red transition-colors duration-300">PRIVACIDADE</a>
           </nav>

           <!-- Social Icons -->
           <div class="flex gap-5 text-gray-400">
             <a href="#" class="hover:text-white hover:scale-110 transition-all duration-300 bg-white/5 p-2 rounded-full"><Instagram class="w-5 h-5" /></a>
             <a href="#" class="hover:text-white hover:scale-110 transition-all duration-300 bg-white/5 p-2 rounded-full"><Facebook class="w-5 h-5" /></a>
             <a href="#" class="hover:text-white hover:scale-110 transition-all duration-300 bg-white/5 p-2 rounded-full"><Linkedin class="w-5 h-5" /></a>
             <a href="#" class="hover:text-white hover:scale-110 transition-all duration-300 bg-white/5 p-2 rounded-full"><Twitter class="w-5 h-5" /></a>
           </div>
         </div>
         
         <!-- Divider and Copyright -->
         <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 gap-4">
            <p>© 2024 Uffizi Uniformes. All rights reserved.</p>
            <p>Design Recreation for Portfolio.</p>
         </div>
       </div>
    </div>
  </footer>
</template>