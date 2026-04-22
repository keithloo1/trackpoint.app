import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { getPocketBaseErrorMessage } from '../lib/pocketbaseError'
import pb from '../lib/pocketbase'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => pb.authStore.record)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.record)
      setIsInitializing(false)
    })

    return unsubscribe
  }, [])

  async function login(email, password) {
    setIsLoading(true)
    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(email, password)
      setUser(authData.record)
      return authData.record
    } catch (error) {
      throw new Error(
        getPocketBaseErrorMessage(
          error,
          'Unable to sign in with those credentials.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function signup({ name, email, password, passwordConfirm }) {
    setIsLoading(true)
    try {
      await pb.collection('users').create({
        name,
        email,
        password,
        passwordConfirm,
      })
      const authData = await pb.collection('users').authWithPassword(
        email,
        password,
      )
      setUser(authData.record)
      return authData.record
    } catch (error) {
      throw new Error(
        getPocketBaseErrorMessage(
          error,
          'Unable to create your account right now.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    pb.authStore.clear()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isInitializing,
      login,
      signup,
      logout,
    }),
    [isInitializing, isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
