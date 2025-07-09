// pages/api/subscribe.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const { data, error } = await supabase.from('emails').insert([{ email }])

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong' })
  }

  return res.status(200).json({ success: true, message: 'Email saved' })
}
