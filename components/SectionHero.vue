<script setup>
import { ref, onMounted } from 'vue'

const status = ref('pending')
const data = ref(null)

onMounted(async () => {
  // Simulate delay
  setTimeout(() => {
    data.value = {
      title: 'Reimaginando uniformes para sua empresa.',
      description: 'Uniformes modernos, confortáveis e com a identidade da sua marca. Descubra como podemos transformar a imagem do seu time com estilo e profissionalismo.',
      img: 'https://placehold.co/600x800/800000/FFFFFF?text=3D+Illustration\nPeople+In+Uniform'
    }
    status.value = 'success'
  }, 1500)
})
</script>

<template>
  <section class="relative pt-24 pb-20 md:pt-32 lg:pt-40 bg-brand-light overflow-hidden min-h-[85vh] flex flex-col justify-center">
    <div class="container mx-auto px-6 relative z-20">
      
      <div v-if="status === 'pending'" class="grid md:grid-cols-2 gap-12 items-center animate-pulse">
        <div class="space-y-6">
          <div class="h-4 w-32 bg-gray-200 rounded"></div>
          <div class="h-16 w-3/4 bg-gray-200 rounded-lg"></div>
          <div class="h-16 w-2/3 bg-gray-200 rounded-lg"></div>
          <div class="space-y-2">
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
          </div>
          <div class="h-12 w-40 bg-brand-red/20 rounded-full mt-4"></div>
        </div>
        <div class="h-[400px] w-full bg-gray-200 rounded-3xl"></div>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-8 h-[2px] bg-brand-red"></span>
            <span class="uppercase text-xs font-bold tracking-widest text-brand-red">Uffizi Uniformes</span>
          </div>
          
          <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-brand-dark">
            Reimaginando <br />
            uniformes para sua <br />
            <span class="text-brand-red">empresa.</span>
          </h1>
          
          <p class="text-gray-500 max-w-md leading-relaxed">
            {{ data.description }}
          </p>

          <button class="px-8 py-3 bg-brand-red text-white font-semibold rounded-full shadow-xl shadow-brand-red/40 hover:scale-105 transition-transform">
            Saiba mais
          </button>
        </div>

        <div class="relative h-[400px] md:h-[500px] w-full flex items-center justify-center">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-red-100 to-transparent opacity-50 blur-3xl rounded-full"></div>
          
          <div class="relative z-10 w-full h-full transition-opacity duration-700 ease-in">
            <img 
              :src="data.img" 
              alt="3D Illustration" 
              class="object-contain w-full h-full drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>