// Fonte única dos dados de contato e identidade do salão.
// ATENÇÃO: telefone, e-mail e endereço abaixo são PLACEHOLDERS —
// substituir pelos dados reais antes do lançamento.

export const SITE = {
  nome: 'Taisa Ateliê',
  cidade: 'São Paulo, SP',

  // TODO(lançamento): trocar pelo número real com DDI (55 + DDD + número)
  whatsappNumero: '5511987654321',
  telefoneExibicao: '(11) 98765-4321',

  // TODO(lançamento): trocar pelo e-mail real
  email: 'contato@taisa.com.br',

  instagram: 'https://www.instagram.com/taisa.studio/',

  horarios: [
    { label: 'Seg – Sex', valor: '09h às 19h' },
    { label: 'Sábado', valor: '10h às 17h' },
    { label: 'Domingo', valor: 'Fechado' },
  ],
} as const

export function whatsappUrl(mensagem: string): string {
  return `https://wa.me/${SITE.whatsappNumero}?text=${encodeURIComponent(mensagem)}`
}
