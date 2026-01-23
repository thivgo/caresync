import { ref } from 'vue'

const isLoginOpen = ref(false)

export const useLoginModal = () => isLoginOpen