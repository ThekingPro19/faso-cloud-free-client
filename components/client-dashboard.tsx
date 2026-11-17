'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDownLeft, ArrowUpRight, Bell, Check, ChevronRight, CircleHelp, Copy, History, LayoutDashboard, LogOut, Menu, Settings2, ShieldCheck, UserRound, UsersRound, WalletCards, X, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Section = 'overview' | 'profile' | 'referrals' | 'history'
type Language = 'fr' | 'en'

const labels = {
  fr: { overview: 'Vue d’ensemble', profile: 'Mon profil', referrals: 'Parrainage', history: 'Historique', hello: 'Bonjour', space: 'Votre espace client', account: 'COMPTE CLIENT', balance: 'Solde du compte', noBalance: 'Aucune donnée de solde', balanceNote: 'Les informations de solde apparaîtront ici si elles sont fournies par le service.', activity: 'Activité récente', viewAll: 'Tout voir', none: 'Aucune opération pour le moment', noneHint: 'Vos opérations apparaîtront ici lorsqu’elles seront disponibles.', referralTitle: 'Partagez votre expérience', referralBody: 'Votre espace de parrainage sera disponible lorsque le programme officiel sera connecté à votre compte.', referralEmpty: 'Aucun lien ni parrainage enregistré', name: 'Nom complet', email: 'Adresse e-mail', save: 'Enregistrer les modifications', saved: 'Profil mis à jour.', saveError: 'Impossible de mettre à jour le profil. Réessayez.', profileTitle: 'Vos informations', profileHint: 'Ces informations sont associées à votre compte.', verify: 'E-mail confirmé', notVerify: 'E-mail à confirmer', status: 'Statut', active: 'Compte sécurisé', language: 'Langue', empty: 'Rien à afficher', logout: 'Déconnexion', memberSince: 'Membre depuis', verified: 'Vérifié', noReal: 'Les soldes, activités de minage et paiements ne sont pas simulés.', menu: 'Menu', operation: 'Opération', date: 'Date', amount: 'Montant', open: 'Ouvrir le menu' },
  en: { overview: 'Overview', profile: 'My profile', referrals: 'Referrals', history: 'History', hello: 'Hello', space: 'Your client space', account: 'CLIENT ACCOUNT', balance: 'Account balance', noBalance: 'No balance data', balanceNote: 'Balance information will appear here if provided by the service.', activity: 'Recent activity', viewAll: 'View all', none: 'No operations yet', noneHint: 'Your operations will appear here when available.', referralTitle: 'Share your experience', referralBody: 'Your referral space will be available once the official program is connected to your account.', referralEmpty: 'No referral link or invitations recorded', name: 'Full name', email: 'Email address', save: 'Save changes', saved: 'Profile updated.', saveError: 'Could not update your profile. Please try again.', profileTitle: 'Your information', profileHint: 'These details are linked to your account.', verify: 'Email confirmed', notVerify: 'Email confirmation pending', status: 'Status', active: 'Account secure', language: 'Language', empty: 'Nothing to show', logout: 'Sign out', memberSince: 'Member since', verified: 'Verified', noReal: 'Balances, mining activity, and payments are not simulated.', menu: 'Menu', operation: 'Operation', date: 'Date', amount: 'Amount', open: 'Open menu' },
}

export function ClientDashboard({ email, fullName, verified, createdAt }: { email: string; fullName: string; verified: boolean; createdAt: string }) {
  const [section, setSection] = useState<Section>('overview')
  const [lang, setLang] = useState<Language>('fr')
  const [name, setName] = useState(fullName)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const t = labels[lang]
  const initials = name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'FC'
  const nav: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [{ id: 'overview', label: t.overview, icon: LayoutDashboard }, { id: 'profile', label: t.profile, icon: UserRound }, { id: 'referrals', label: t.referrals, icon: UsersRound }, { id: 'history', label: t.history, icon: History }]

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setSaved(false)
    const { error: updateError } = await createClient().auth.updateUser({ data: { full_name: name.trim() } })
    if (updateError) setError(t.saveError)
    else setSaved(true)
    setBusy(false)
  }

  async function logout() {
    await createClient().auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <main className="dashboard-app">
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand"><a className="brand" href="/"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span><span>FASO <b>CLOUD</b><small>FREE</small></span></a><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
        <div className="sidebar-section-label">{t.menu}</div>
        <nav className="dashboard-nav" aria-label={t.menu}>{nav.map(item => <button className={`nav-item ${section === item.id ? 'nav-item-active' : ''}`} key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false) }}><item.icon size={18} /><span>{item.label}</span>{section === item.id && <ChevronRight className="nav-chevron" size={15} />}</button>)}</nav>
        <div className="sidebar-bottom"><div className="support-card"><div className="support-icon"><CircleHelp size={17} /></div><strong>{lang === 'fr' ? 'Besoin d’aide ?' : 'Need a hand?'}</strong><span>{lang === 'fr' ? 'Les coordonnées seront ajoutées prochainement.' : 'Support contact details will be added soon.'}</span></div><button className="nav-item logout-button" onClick={logout}><LogOut size={18} /><span>{t.logout}</span></button><div className="user-mini"><span className="avatar-small">{initials}</span><span className="user-mini-text"><b>{name || email.split('@')[0]}</b><small>{email}</small></span><Settings2 size={16} /></div></div>
      </aside>
      {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
      <section className="dashboard-main">
        <header className="dashboard-topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label={t.open}><Menu size={20} /></button><span className="breadcrumb">{t.space}<ChevronRight size={14} /> <b>{t[section]}</b></span></div><div className="topbar-actions"><span className="secure-chip"><ShieldCheck size={14} />{t.active}</span><button className="language-switch" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label="Change language">{lang.toUpperCase()}</button><button className="notification-button" aria-label={lang === 'fr' ? 'Notifications' : 'Notifications'}><Bell size={17} /><i /></button><span className="avatar-small top-avatar">{initials}</span></div></header>
        <div className="dashboard-content">
          {section === 'overview' && <>
            <div className="dashboard-heading"><div><span className="card-kicker">{t.account}</span><h1>{t.hello}{name ? `, ${name.split(' ')[0]}` : ''}</h1><p>{t.space}. {lang === 'fr' ? 'Voici votre aperçu personnel.' : 'Here’s your personal overview.'}</p></div><span className="date-chip">{new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'long' }).format(new Date())}</span></div>
            <div className="overview-grid"><article className="balance-card"><div className="balance-card-top"><span className="balance-symbol"><WalletCards size={19} /></span><span className="balance-label">{t.balance}</span><span className="balance-tag"><ShieldCheck size={13} />{lang === 'fr' ? 'Compte' : 'Account'}</span></div><div className="balance-placeholder"><span className="balance-zero">—</span><span>{t.noBalance}</span></div><p>{t.balanceNote}</p><div className="balance-card-decoration" aria-hidden="true" /></article><article className="account-status-card"><div className="status-card-head"><span className="status-card-icon"><ShieldCheck size={19} /></span><span className="status-live"><i />{lang === 'fr' ? 'SÉCURISÉ' : 'SECURE'}</span></div><h3>{t.status}</h3><p>{verified ? t.verify : t.notVerify}</p><div className="status-detail"><span>{t.memberSince}</span><b>{new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' }).format(new Date(createdAt))}</b></div></article></div>
            <section className="content-card activity-card"><div className="content-card-head"><div><span className="card-kicker">{lang === 'fr' ? 'VOTRE COMPTE' : 'YOUR ACCOUNT'}</span><h2>{t.activity}</h2></div><button className="text-action" onClick={() => setSection('history')}>{t.viewAll}<ArrowUpRight size={15} /></button></div><div className="empty-activity"><span className="empty-icon"><ArrowDownLeft size={20} /></span><strong>{t.none}</strong><p>{t.noneHint}</p></div></section>
            <p className="dashboard-note"><ShieldCheck size={15} />{t.noReal}</p>
          </>}
          {section === 'profile' && <><div className="dashboard-heading"><div><span className="card-kicker">{lang === 'fr' ? 'COMPTE' : 'ACCOUNT'}</span><h1>{t.profile}</h1><p>{t.profileHint}</p></div></div><section className="content-card profile-card"><div className="profile-intro"><span className="avatar-large">{initials}</span><div><h2>{name || (lang === 'fr' ? 'Votre profil' : 'Your profile')}</h2><span>{email}</span></div></div><form className="profile-form" onSubmit={saveProfile}><label>{t.name}<input value={name} onChange={event => setName(event.target.value)} minLength={2} required /></label><label>{t.email}<span className="read-only-field">{email}<span className="verified-label"><ShieldCheck size={13} />{verified ? t.verified : (lang === 'fr' ? 'En attente' : 'Pending')}</span></span></label>{error && <p className="form-feedback form-error" role="alert">{error}</p>}{saved && <p className="form-feedback form-success" role="status">{t.saved}</p>}<button className="button button-dark profile-submit" disabled={busy}>{busy ? '…' : t.save}<ArrowUpRight size={15} /></button></form></section></>}
          {section === 'referrals' && <><div className="dashboard-heading"><div><span className="card-kicker">{lang === 'fr' ? 'COMMUNAUTÉ' : 'COMMUNITY'}</span><h1>{t.referrals}</h1><p>{lang === 'fr' ? 'Retrouvez ici les informations officielles de votre programme.' : 'Find official information about your referral program here.'}</p></div></div><section className="content-card referral-card"><div className="referral-illustration"><span><UsersRound size={26} /></span><i /><i /><i /></div><span className="card-kicker">{lang === 'fr' ? 'ESPACE PARRAINAGE' : 'REFERRAL SPACE'}</span><h2>{t.referralTitle}</h2><p>{t.referralBody}</p><div className="empty-referral"><UsersRound size={16} />{t.referralEmpty}</div></section></>}
          {section === 'history' && <><div className="dashboard-heading"><div><span className="card-kicker">{lang === 'fr' ? 'VOTRE COMPTE' : 'YOUR ACCOUNT'}</span><h1>{t.history}</h1><p>{lang === 'fr' ? 'Consultez vos opérations disponibles.' : 'Review available account operations.'}</p></div></div><section className="content-card history-card"><div className="table-header"><span>{t.operation}</span><span>{t.date}</span><span>{t.amount}</span></div><div className="empty-activity"><span className="empty-icon"><History size={20} /></span><strong>{t.none}</strong><p>{t.noneHint}</p></div></section></>}
        </div>
      </section>
    </main>
  )
}
