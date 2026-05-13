import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Servico {
  _id: string
  nome: string
  descricao: string
  preco: number
  duracao?: number
}

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServicos()
  }, [])

  const fetchServicos = async () => {
    try {
      const response = await fetch('http://localhost:3333/servicos')
      if (response.ok) {
        const data = await response.json()
        setServicos(data)
      } else {
        setError('Erro ao carregar serviços')
      }
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden hero-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-dourado/20 via-rosa-claro/30 to-creme"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-28 text-center">
          <span className="section-subtitle">Serviços</span>
          <h1 className="section-title text-4xl md:text-5xl mt-5">Transformações sofisticadas para cada momento.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted leading-relaxed">
            Conheça todos os tratamentos que combinam técnica, beleza e cuidado personalizado para entregar resultados de alto padrão.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        {loading ? (
          <div className="text-center py-14">
            <p className="text-rosa text-base">Carregando serviços...</p>
          </div>
        ) : error ? (
          <div className="text-center py-14">
            <p className="text-rosa text-base">{error}</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {servicos.map((servico) => (
              <div key={servico._id} className="glass-card rounded-[32px] overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-soft">
                <div className="p-8">
                  <div className="mb-4 inline-flex rounded-full bg-dourado/15 px-4 py-2 text-sm uppercase tracking-[0.2em] text-dourado font-semibold">
                    Serviço premium
                  </div>
                  <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {servico.nome}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted mb-6">{servico.descricao}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted">Preço</p>
                      <p className="text-2xl font-bold text-bordo">R$ {servico.preco.toFixed(2)}</p>
                    </div>
                    {servico.duracao && (
                      <div>
                        <p className="text-sm text-muted">Duração</p>
                        <p className="text-lg font-semibold text-bordo">{servico.duracao} min</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-rosa-claro/50 px-8 py-6 border-t border-rosa-claro/30">
                  <Link to="/agendamento" className="btn-primary w-full text-center">
                    Agendar este serviço
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 bg-rosa-claro/60 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Precisa de ajuda para escolher?
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed mx-auto max-w-2xl">
            Nossa equipe está pronta para orientar você na escolha do serviço ideal para alcançar o visual que você deseja.
          </p>
          <div className="mt-10 flex justify-center">
            <Link to="/contato" className="btn-primary">
              Falar com um especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
