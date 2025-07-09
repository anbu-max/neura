// pages/api/subscribe.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)



export default async function handler(req, res) {
  console.log("📥 Incoming Request:", req.method, req.body)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  console.log("📧 Email received:", email)

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  try {
    const { data, error } = await supabase.from('emails').insert([{ email }])
    if (error) {
      console.error("❌ Supabase insert error:", error)
      return res.status(500).json({ error: 'Failed to save email' })
    }
    console.log("✅ Email inserted:", data)
    return res.status(200).json({ success: true, message: 'Email saved!' })
  } catch (err) {
    console.error("🔥 Caught Exception:", err)
    return res.status(500).json({ error: 'Something broke' })
  }
}


