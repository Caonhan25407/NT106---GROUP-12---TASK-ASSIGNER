/**
 * Backend integration starter — NOT used by the mock UI yet.
 * ASP.NET Core Web API should authenticate users and enforce authorization.
 * Never connect Vue directly to SQL Server or send DB credentials to the browser.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // only for cookie-backed auth, configured CORS + CSRF on backend
    headers: { 'Content-Type': 'application/json', ...options.headers }
  })
  if (!response.ok) {
    let message = `API request failed (${response.status})`
    try { const error = await response.json(); message = error.message || error.title || message } catch { /* ignore response parsing failures */ }
    throw new ApiError(response.status, message)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
