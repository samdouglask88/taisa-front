import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../config/site'

const DEFAULT_MESSAGE = 'Olá! Vim pelo site e gostaria de saber mais sobre os serviços do Taisa Ateliê.'

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2} fill="white" />
    </a>
  )
}
