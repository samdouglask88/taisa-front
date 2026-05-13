import { useState } from 'react'

interface FormData {
  nome: string
  email: string
  telefone: string
  assunto: string
  mensagem: string
}

export default function Contato() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      setSubmitted(true)
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden hero-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-dourado/20 via-rosa-claro/30 to-creme"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-28 text-center">
          <span className="section-subtitle">Contato</span>
          <h1 className="section-title text-4xl md:text-5xl mt-5">Estamos prontos para ouvir você.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted leading-relaxed">
            Deixe sua mensagem e nossa equipe entrará em contato com rapidez para garantir sua melhor experiência.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16 grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="glass-card p-10 shadow-soft">
          <h2 className="text-3xl font-semibold mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Envie sua mensagem
          </h2>
          {submitted && (
            <div className="mb-6 rounded-3xl bg-dourado/15 p-5 text-bordo">
              <p className="font-semibold">Mensagem enviada com sucesso!</p>
              <p className="text-sm text-muted mt-1">Retornaremos o contato em breve.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-bordo">Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="w-full rounded-3xl border border-rosa-claro bg-creme px-4 py-3 focus:border-dourado focus:outline-none"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2 text-bordo">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-3xl border border-rosa-claro bg-creme px-4 py-3 focus:border-dourado focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-bordo">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-3xl border border-rosa-claro bg-creme px-4 py-3 focus:border-dourado focus:outline-none"
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-bordo">Assunto</label>
              <select
                name="assunto"
                value={formData.assunto}
                onChange={handleInputChange}
                required
                className="w-full rounded-3xl border border-rosa-claro bg-creme px-4 py-3 focus:border-dourado focus:outline-none"
              >
                <option value="">Selecione um assunto</option>
                <option value="agendamento">Dúvida sobre agendamento</option>
                <option value="servico">Informações sobre serviços</option>
                <option value="feedback">Feedback / Sugestão</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-bordo">Mensagem</label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full rounded-3xl border border-rosa-claro bg-creme px-4 py-3 focus:border-dourado focus:outline-none"
                placeholder="Escreva sua mensagem aqui."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 shadow-soft">
            <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Informações de contato
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              📞 (11) 98765-4321<br />
              ✉️ contato@taisa.com.br<br />
              📍 São Paulo, SP
            </p>
          </div>

          <div className="glass-card p-8 shadow-soft">
            <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Atendimento
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Segunda a Sexta: 09:00 - 19:00<br />
              Sábado: 10:00 - 17:00<br />
              Domingo: Fechado
            </p>
          </div>

          <div className="glass-card p-8 shadow-soft">
            <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Redes sociais
            </h3>
            <div className="flex items-center gap-4 text-3xl">
              <a href="#" className="transition hover:text-dourado">📷</a>
              <a href="#" className="transition hover:text-dourado">f</a>
              <a href="#" className="transition hover:text-dourado">💬</a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="glass-card overflow-hidden shadow-soft rounded-[32px] h-[420px] bg-rosa-claro/70">
          <div className="flex h-full items-center justify-center text-bordo text-xl">
            <p>🗺️ Mapa interativo aqui - integrar Google Maps</p>
          </div>
        </div>
      </section>
    </div>
  )
}
