import { redirect } from 'next/navigation'
import { ClientDashboard } from '@/components/client-dashboard'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <ClientDashboard email={user.email ?? ''} fullName={typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : ''} verified={Boolean(user.email_confirmed_at)} createdAt={user.created_at} />
}
