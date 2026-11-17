import Link from 'next/link'

export default function AuthErrorPage() {
  return <main className="auth-page"><section className="auth-panel auth-error-page"><span className="card-kicker">FASO CLOUD FREE</span><h1>Le lien n’est plus valide</h1><p>Le lien a peut-être expiré ou a déjà été utilisé. Demandez-en un nouveau pour continuer.</p><Link className="button button-dark" href="/login">Retour à la connexion</Link></section></main>
}
