<script setup>
import { ref, onMounted } from 'vue'
import { Briefcase, User, Star, TrendingUp, ShieldCheck } from 'lucide-vue-next'

const status = ref('pending')
const data = ref(null)

onMounted(async () => {
  setTimeout(() => {
    data.value = {
      features: [
        {
          title: 'Para Empresas',
          desc: 'Soluções completas para grandes equipes. Gestão de estoque, tamanhos personalizados e logística integrada.',
          icon: 'Briefcase',
          image: 'https://placehold.co/400x400/222222/690A0A?text=Worker+3D'
        },
        {
          title: 'Para Empreendedores',
          desc: 'Pequenos lotes com alta qualidade. Ideal para startups e pequenos negócios que querem profissionalizar a imagem.',
          icon: 'User',
          image: 'https://placehold.co/400x400/222222/690A0A?text=Entrepreneur+3D'
        }
      ],
      timeline: [
        { year: '2021', title: 'Fundação', desc: 'Início das operações em SP.' },
        { year: '2022', title: 'Expansão', desc: 'Abertura de nova fábrica.' },
        { year: '2023', title: 'Tecnologia', desc: 'Plataforma de gestão digital.' },
        { year: '2024', title: 'Internacional', desc: 'Primeiros contratos globais.' },
      ]
    }
    status.value = 'success'
  }, 2000)
})
</script>

<template>
  <section class="bg-brand-dark text-white pb-32 pt-10 min-h-[80vh]">
    
    <div class="container mx-auto px-6 mb-24">
      <div class="flex flex-col md:flex-row gap-8 items-end mb-16">
        <div class="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center text-xl font-bold font-display">
          U
        </div>
        <div>
          <h2 class="text-3xl font-display font-bold">O que faz a<br>gente diferente?</h2>
        </div>
        <p class="text-gray-400 max-w-md text-sm md:ml-auto">
          Não entregamos apenas roupas, entregamos auto-estima e pertencimento para o seu colaborador.
        </p>
      </div>

      <div v-if="status === 'pending'" class="grid md:grid-cols-2 gap-8 animate-pulse">
        <div class="bg-brand-card/50 rounded-3xl h-96 w-full border border-white/5"></div>
        <div class="bg-brand-card/50 rounded-3xl h-96 w-full border border-white/5"></div>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-8">
        <div v-for="feature in data.features" :key="feature.title" class="bg-brand-card rounded-3xl p-8 border border-white/5 hover:border-brand-red/30 transition-colors group relative overflow-hidden">
          <div class="relative z-10 flex flex-col h-full">
             <div class="h-48 mb-6 flex justify-center items-center">
                <img :src="feature.image" class="h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" alt="3D Avatar" />
             </div>
             
             <div class="text-center mt-auto">
               <h3 class="text-xl font-display font-bold mb-3">Para <span class="text-brand-red">{{ feature.title.split(' ')[1] }}</span></h3>
               <p class="text-gray-400 text-sm mb-6">{{ feature.desc }}</p>
               <button class="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center mx-auto hover:bg-brand-red hover:border-brand-red transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative bg-gradient-to-r from-brand-card to-brand-dark py-16 mb-24">
      <div class="container mx-auto px-6">
        
        <div v-if="status === 'pending'" class="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse">
             <div class="h-20 bg-white/5 rounded"></div>
             <div class="h-20 bg-white/5 rounded"></div>
             <div class="h-20 bg-white/5 rounded"></div>
             <div class="h-20 bg-white/5 rounded"></div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="item in data.timeline" :key="item.year" class="relative pl-6 border-l border-brand-red/30 hover:border-brand-red transition-colors">
            <span class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-red"></span>
            <div class="text-brand-red font-bold mb-1">{{ item.year }}</div>
            <h4 class="font-bold text-white mb-1">{{ item.title }}</h4>
            <p class="text-xs text-gray-500">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6">
      <div class="bg-brand-card rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
        <div class="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h3 class="text-3xl font-display font-bold mb-6">Uffizi Uniformes</h3>
            <p class="text-gray-400 mb-8 leading-relaxed">
              Tecnologia têxtil de ponta aplicada ao dia a dia. Nossos tecidos possuem tecnologia 
              anti-odor, secagem rápida e não precisam ser passados. O futuro do workwear chegou.
            </p>
            <ul class="space-y-4 text-sm text-gray-300">
              <li class="flex items-center gap-3"><ShieldCheck class="text-brand-red w-5 h-5"/> Durabilidade extrema</li>
              <li class="flex items-center gap-3"><Star class="text-brand-red w-5 h-5"/> Conforto térmico</li>
              <li class="flex items-center gap-3"><TrendingUp class="text-brand-red w-5 h-5"/> Alta performance</li>
            </ul>
          </div>
          
          <div class="relative h-[400px] flex items-center justify-center">
             <div class="absolute top-10 right-10 w-24 h-12 bg-white rounded-full blur-xl opacity-20 animate-pulse"></div>
             <div class="absolute bottom-10 left-10 w-32 h-16 bg-white rounded-full blur-xl opacity-20 animate-pulse delay-700"></div>
             
             <img src="https://placehold.co/500x500/8B1A1A/FFFFFF?text=Red+Shirt+3D" class="relative z-10 drop-shadow-[0_20px_50px_rgba(200,30,30,0.3)] transform hover:-translate-y-2 transition-transform duration-700" alt="Product" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>