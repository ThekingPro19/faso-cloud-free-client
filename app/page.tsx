'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Globe2, ShieldCheck, Sparkles, UserRound, UsersRound, WalletCards, Zap } from 'lucide-react'

type Language = 'fr' | 'en'

const copy = {
  fr: {
    signIn: 'Connexion', create: 'Créer un compte', eyebrow: 'VOTRE ESPACE, EN TOUTE SIMPLICITÉ',
    title: 'Le cloud, pensé pour vous.', subtitle: 'Retrouvez vos informations et gérez votre compte FASO CLOUD Free dans un espace clair, sécurisé et accessible partout.',
    access: 'Accédez à votre espace', accessHint: 'Un seul endroit pour votre compte et vos informations.',
    features: ['Un espace personnel sécurisé', 'Un suivi transparent de vos opérations', 'Un programme de parrainage dédié'],
    note: 'Aucun solde, minage ou paiement n’est simulé dans cette interface.',
    secure: 'Connexion sécurisée', account: 'Espace client', referral: 'Parrainage', history: 'Historique',
  },
  en: {
    signIn: 'Sign in', create: 'Create account', eyebrow: 'YOUR SPACE, SIMPLIFIED',
    title: 'Cloud, made personal.', subtitle: 'Find your information and manage your FASO CLOUD Free account in a clear, secure space that goes wherever you do.',
    access: 'Your account, all in one place', accessHint: 'One simple place for your account and information.',
    features: ['A secure personal space', 'Transparent operation history', 'A dedicated referral area'],
    note: 'No balance, mining activity, or payment is simulated in this interface.',
    secure: 'Secure access', account: 'Client space', referral: 'Referrals', history: 'History',
  },
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('fr')
  const t = copy[language]

  return (
    <main className="landing-page">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="FASO CLOUD Free — accueil">
          <span className="brand-mark"><Zap size={19} fill="currentColor" /></span>
          <span>FASO <b>CLOUD</b><small>FREE</small></span>
        </Link>
        <nav className="header-actions" aria-label="Navigation principale">
          <button className="language-switch" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}><Globe2 size={16} /> {language.toUpperCase()}</button>
          <Link className="button button-quiet" href="/login">{t.signIn}</Link>
          <Link className="button button-dark" href="/signup">{t.create}<ArrowUpRight size={16} /></Link>
        </nav>
      </header>

      <section className="landing-grid">
        <div className="landing-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p className="lead">{t.subtitle}</p>
          <div className="feature-list">
            {t.features.map((item, index) => <div className="feature-row" key={item}><span className="feature-icon">{index === 0 ? <ShieldCheck size={18} /> : index === 1 ? <WalletCards size={18} /> : <UsersRound size={18} />}</span><span>{item}</span><ArrowUpRight className="feature-arrow" size={16} /></div>)}
          </div>
          <div className="disclaimer"><ShieldCheck size={17} /><span>{t.note}</span></div>
        </div>

        <div className="portal-card">
          <div className="portal-card-top"><div className="portal-icon"><UserRound size={20} /></div><span className="online-indicator"><i /> {t.secure}</span></div>
          <div className="portal-card-content">
            <span className="card-kicker">FASO CLOUD FREE</span>
            <h2>{t.access}</h2>
            <p>{t.accessHint}</p>
            <div className="portal-links">
              <Link href="/dashboard" className="portal-link"><span><WalletCards size={17} />{t.account}</span><ArrowUpRight size={16} /></Link>
              <Link href="/dashboard?section=referrals" className="portal-link"><span><UsersRound size={17} />{t.referral}</span><ArrowUpRight size={16} /></Link>
              <Link href="/dashboard?section=history" className="portal-link"><span><Sparkles size={17} />{t.history}</span><ArrowUpRight size={16} /></Link>
            </div>
            <Link href="/login" className="button button-dark portal-cta">{t.signIn}<ArrowDownRight size={17} /></Link>
            <div className="portal-foot"><ShieldCheck size={14} /> Vos données restent privées et protégées</div>
          </div>
          <div className="portal-card-glow" aria-hidden="true" />
        </div>
      </section>
      <footer className="landing-footer"><span>© 2026 FASO CLOUD Free</span><span>Un service pensé pour l’essentiel.</span></footer>
    </main>
  )
}
