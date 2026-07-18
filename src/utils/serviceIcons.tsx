import { createElement } from 'react'
import { Scissors, Palette, Sparkles, Gift, Droplet, Brush, Waves, Gem } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const NAME_ICONS: Record<string, LucideIcon> = {
  corte: Scissors,
  escova: Droplet,
  coloração: Palette,
  coloracao: Palette,
  progressiva: Droplet,
  sobrancelha: Sparkles,
  ritual: Gift,
  hidratação: Droplet,
  hidratacao: Droplet,
  maquiagem: Brush,
  pés: Waves,
  pes: Waves,
  manicure: Gem,
  pedicure: Gem,
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  cabelo: Scissors,
  unhas: Gem,
  'estética': Sparkles,
  estetica: Sparkles,
  pacote: Gift,
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mark}/gu, '')
}

function iconForService(nome: string, categoria: string): LucideIcon {
  const normalizedName = normalize(nome)
  const nameMatch = Object.entries(NAME_ICONS).find(([key]) => normalizedName.includes(normalize(key)))
  if (nameMatch) return nameMatch[1]

  const normalizedCategory = normalize(categoria)
  return CATEGORY_ICONS[normalizedCategory] ?? Sparkles
}

interface ServiceIconProps {
  nome?: string
  categoria: string
  size?: number
  className?: string
}

export function ServiceIcon({ nome = '', categoria, size = 24, className }: ServiceIconProps) {
  // createElement em vez de JSX: os ícones vêm de Records estáticos, nenhum
  // componente é criado durante o render — só selecionado
  return createElement(iconForService(nome, categoria), { size, strokeWidth: 1.75, className })
}
