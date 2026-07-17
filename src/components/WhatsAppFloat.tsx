import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '5511987654321'
const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de saber mais sobre os serviços do Taisa Ateliê.'

export default function WhatsAppFloat() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2} fill="white" />
    </a>
  )
}
