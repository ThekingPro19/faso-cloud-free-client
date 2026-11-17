'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Globe2, Mail, ShieldCheck, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup' | 'forgot' | 'reset'
type Language = 'fr' | 'en'
function callbackUrl(next: string) {
  const base = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`
  const url = new URL(base, window.location.origin)
  url.searchParams.set('next', next)
  return url.toString()
}

const wording = {
  fr: {
    login: ['Ravi de vous revoir.', 'Connectez-vous à votre espace client FASO CLOUD Free.', 'Adresse e-mail', 'Mot de passe', 'Mot de passe oublié ?', 'Se connecter', 'Pas encore de compte ?', 'Créer un compte'],
    signup: ['Bienvenue chez vous.', 'Créez votre espace client en quelques instants.', 'Nom complet', 'Adresse e-mail', 'Mot de passe', 'Créer mon compte', 'Déjà inscrit ?', 'Se connecter'],
    forgot: ['On vous aide à revenir.', 'Indiquez votre adresse e-mail pour recevoir un lien de réinitialisation.', 'Adresse e-mail', 'Envoyer le lien', 'Retour à la connexion'],
    reset: ['Choisissez un nouveau mot de passe.', 'Utilisez au moins 8 caractères.', 'Nouveau mot de passe', 'Confirmer le mot de passe', 'Mettre à jour le mot de passe'],
    emailSent: 'Consultez votre boîte de réception pour confirmer votre adresse e-mail.', resetSent: 'Si un compte correspond à cette adresse, un lien de réinitialisation sera envoyé.',
    generic: 'Une erreur est survenue. Veuillez réessayer.', weak: 'Choisissez un mot de passe plus robuste.', mismatch: 'Les mots de passe ne correspondent pas.', confirmed: 'Veuillez confirmer votre adresse e-mail avant de vous connecter.', invalid: 'Adresse e-mail ou mot de passe invalide.', rate: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
    tagline: 'Votre espace client, simplement.', back: 'Retour à l’accueil', secure: 'Connexion sécurisée par Supabase',
  },
  en: {
    login: ['Welcome back.', 'Sign in to your FASO CLOUD Free client space.', 'Email address', 'Password', 'Forgot password?', 'Sign in', 'New here?', 'Create account'],
    signup: ['Make yourself at home.', 'Create your client space in just a few moments.', 'Full name', 'Email address', 'Password', 'Create my account', 'Already registered?', 'Sign in'],
    forgot: ['Let’s get you back in.', 'Enter your email address to receive a reset link.', 'Email address', 'Send reset link', 'Back to sign in'],
    reset: ['Choose a new password.', 'Use at least 8 characters.', 'New password', 'Confirm password', 'Update password'],
    emailSent: 'Check your inbox to confirm your email address.', resetSent: 'If an account matches this address, a reset link will be sent.',
    generic: 'Something went wrong. Please try again.', weak: 'Please choose a stronger password.', mismatch: 'Passwords do not match.', confirmed: 'Please confirm your email address before signing in.', invalid: 'Invalid email or password.', rate: 'Too many attempts. Please wait before trying again.',
    tagline: 'Your client space, made simple.', back: 'Back to home', secure: 'Secure sign-in by Supabase',
  },
}

function safeError(error: unknown, mode: Mode, lang: Language) {
  const t = wording[lang]
  const { code, status } = (error ?? {}) as { code?: string; status?: number }
  if (code === 'weak_password') return t.weak
  if (code === 'email_not_confirmed') return t.confirmed
  if (code === 'invalid_credentials') return t.invalid
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit' || status === 429) return t.rate
  if (code === 'email_address_invalid') return lang === 'fr' ? 'Veuillez saisir une adresse e-mail valide.' : 'Please enter a valid email address.'
  return mode === 'login' ? t.invalid : t.generic
}

export function AuthForm({ mode }: { mode: Mode }) {
  const [lang, setLang] = useState<Language>('fr')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const t = wording[lang]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (mode === 'reset' && password !== confirmation) { setError(t.mismatch); return }
    setBusy(true)
    const supabase = createClient()
    try {
      if (mode === 'signup') {
        const { error: authError } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callbackUrl('/dashboard'), data: { full_name: name.trim() } } })
        if (authError) throw authError
        setMessage(t.emailSent)
      } else if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        router.push('/dashboard')
        router.refresh()
      } else if (mode === 'forgot') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl('/reset-password')})
        if (authError) throw authError
        setMessage(t.resetSent)
      } else {
        const { error: authError } = await supabase.auth.updateUser({ password })
        if (authError) throw authError
        router.push('/dashboard')
        router.refresh()
      }
    } catch (authError) {
      setError(safeError(authError, mode, lang))
    } finally {
      setBusy(false)
    }
  }

  const isSimple = mode === 'login' || mode === 'signup'
  const title = isSimple ? t[mode][0] : t[mode][0]
  const description = isSimple ? t[mode][1] : t[mode][1]

  return (
    <main className="auth-page">
      <div className="auth-topbar"><Link className="brand" href="/"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span><span>FASO <b>CLOUD</b><small>FREE</small></span></Link><button className="language-switch" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label="Change language"><Globe2 size={16} />{lang.toUpperCase()}</button></div>
      <div className="auth-layout">
        <aside className="auth-aside"><div className="auth-aside-mark"><ShieldCheck size={21} /></div><span className="eyebrow">FASO CLOUD FREE</span><h1>{t.tagline}</h1><p>{lang === 'fr' ? 'Un accès simple à votre profil, vos informations et votre espace personnel.' : 'Simple access to your profile, information, and personal space.'}</p><div className="auth-aside-bottom"><span className="online-indicator"><i /> {t.secure}</span></div></aside>
        <section className="auth-panel"><Link href="/" className="back-link"><ArrowLeft size={15} />{t.back}</Link><div className="auth-heading"><span className="card-kicker">{lang === 'fr' ? 'ESPACE CLIENT' : 'CLIENT SPACE'}</span><h2>{title}</h2><p>{description}</p></div>
          <form className="auth-form" onSubmit={submit}>
            {mode === 'signup' && <label>{t.signup[2]}<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} required minLength={2} /></label>}
            {(mode === 'login' || mode === 'signup' || mode === 'forgot') && <label>{mode === 'forgot' ? t.forgot[2] : mode === 'signup' ? t.signup[3] : t.login[2]}<span className="input-wrap"><Mail size={16} /><input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></span></label>}
            {(mode === 'login' || mode === 'signup' || mode === 'reset') && <label>{mode === 'reset' ? t.reset[2] : mode === 'signup' ? t.signup[4] : t.login[3]}<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} required minLength={8} /></label>}
            {mode === 'reset' && <label>{t.reset[3]}<input type="password" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} required minLength={8} /></label>}
            {mode === 'login' && <div className="forgot-row"><Link href="/forgot-password">{t.login[4]}</Link></div>}
            {error && <div className="form-feedback form-error" role="alert">{error}</div>}
            {message && <div className="form-feedback form-success" role="status">{message}</div>}
            {!message && <button className="button button-dark auth-submit" disabled={busy}>{busy ? (lang === 'fr' ? 'Veuillez patienter…' : 'Please wait…') : (mode === 'login' ? t.login[5] : mode === 'signup' ? t.signup[5] : mode === 'forgot' ? t.forgot[3] : t.reset[4])}<ArrowRight size={16} /></button>}
          </form>
          {isSimple && <div className="auth-switch">{mode === 'login' ? t.login[6] : t.signup[6]} <Link href={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? t.login[7] : t.signup[7]}</Link></div>}
          {mode === 'forgot' && <div className="auth-switch"><Link href="/login">{t.forgot[4]}</Link></div>}
          <div className="auth-footnote"><ShieldCheck size={14} />{t.secure}</div>
        </section>
      </div>
    </main>
  )
}
