// Em produção, defina VITE_API_URL no ambiente de build (ex.: .env.production)
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('taisa_token')
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options?.headers ?? {}),
        },
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP ${res.status}`)
    }
    return res.json()
}
