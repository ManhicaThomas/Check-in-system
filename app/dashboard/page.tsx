'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface CheckIn {
  id: number
  user_id: string
  time: string
  latitude: number
  longitude: number
  users: {
    user_metadata: {
      first_name: string
      last_name: string
      school: string
    }
  }
}

export default function DashboardPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchCheckIns = async () => {
      const { data, error } = await supabase
        .from('check_ins')
        .select(`
          *,
          users:user_id (user_metadata)
        `)
        .order('time', { ascending: false })
      
      if (error) {
        console.error('Error fetching check-ins:', error)
        return
      }

      setCheckIns(data as CheckIn[])
    }

    fetchCheckIns()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Check-Ins</CardTitle>
          <Button onClick={handleLogout}>Logout</Button>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((checkIn) => (
                <tr key={checkIn.id}>
                  <td>{`${checkIn.users.user_metadata.first_name} ${checkIn.users.user_metadata.last_name}`}</td>
                  <td>{checkIn.users.user_metadata.school}</td>
                  <td>{new Date(checkIn.time).toLocaleString()}</td>
                  <td>
                    {checkIn.latitude && checkIn.longitude
                      ? `${checkIn.latitude.toFixed(6)}, ${checkIn.longitude.toFixed(6)}`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
