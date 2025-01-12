'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function CheckInPage() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/login')
      }
    }
    getUser()

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position.coords)
      })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .insert({
          user_id: user.id,
          time: new Date().toISOString(),
          latitude: location?.latitude,
          longitude: location?.longitude,
        })
      if (error) throw error
      router.push('/dashboard')
    } catch (error) {
      alert('Error checking in: ' + (error as Error).message)
    }
  }

  if (!user) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p>Name: {user.user_metadata.first_name} {user.user_metadata.last_name}</p>
              <p>School: {user.user_metadata.school}</p>
              <p>Location: {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Fetching...'}</p>
            </div>
            <Button type="submit" className="w-full">Check In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
