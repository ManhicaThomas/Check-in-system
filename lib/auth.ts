import { cookies } from 'next/headers'

export function getSession() {
  const session = cookies().get('session')?.value
  return session ? JSON.parse(session) : null
}

export async function login(username: string, password: string) {
  // This is a mock login. In a real app, you'd verify against a database.
  if (username === 'admin' && password === 'password') {
    cookies().set('session', JSON.stringify({ username }), { httpOnly: true })
    return true
  }
  return false
}

export async function logout() {
  cookies().delete('session')
}


