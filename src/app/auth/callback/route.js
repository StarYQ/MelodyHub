// app/api/auth/callback/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getToken } from '@/lib/spotify'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const supabaseCode = searchParams.get('code')
  const spotifyCode = searchParams.get('spotify_code')
  const next = searchParams.get('next') ?? '/'

  // Handle Supabase auth callback
  if (supabaseCode) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(supabaseCode)
    
    if (error) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    // After successful Supabase auth, check for Spotify code
    if (spotifyCode) {
      try {
        // Exchange Spotify authorization code for tokens
        const { access_token, refresh_token } = await getToken(spotifyCode)
        
        // Store Spotify tokens in Supabase
        const { error: storageError } = await supabase
          .from('user_spotify_tokens')
          .upsert({
            user_id: (await supabase.auth.getUser()).data.user.id,
            access_token,
            refresh_token,
            updated_at: new Date().toISOString()
          })

        if (storageError) throw storageError

      } catch (error) {
        console.error('Spotify token storage failed:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }
    }

    // Handle redirects
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    
    const redirectUrl = isLocalEnv ? `${origin}${next}` :
      forwardedHost ? `https://${forwardedHost}${next}` : `${origin}${next}`

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}