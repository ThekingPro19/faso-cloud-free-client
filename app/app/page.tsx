
import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <header style={{ textAlign: "center", padding: "35px 0" }}>
        <h1 style={{ color: "#18c58f", fontSize: "2.5rem" }}>
          FASO CLOUD Free
        </h1>
        <p className="muted">
          Votre espace pour découvrir les services
          de minage Bitcoin de partenaires.
        </p>
      </header>

      <section className="card" style={{ textAlign: "center" }}>
        <h2>Bienvenue sur FASO CLOUD Free</h2>
        <p>
          Découvrez notre plateforme et suivez
          les prochaines étapes de son lancement.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "24px"
        }}>
          <Link href="/register">
            <button>Créer un compte</button>
          </Link>
          <Link href="/login">
            <button>Connexion</button>
          </Link>
        </div>
      </section>

      <section className="card">
        <h2>Nos services</h2>
        <p>
          Accès prévu à des services partenaires
          de minage Bitcoin, sous réserve
          d'accords commerciaux et techniques.
        </p>
      </section>

      <section className="card">
        <h2>Transparence et sécurité</h2>
        <p>
          Le minage réel et les paiements BTC
          ne sont pas encore activés.
          Aucun rendement n'est garanti.
        </p>
      </section>

      <footer style={{
        textAlign: "center",
        padding: "30px 0"
      }}>
        <p className="muted">
          © 2026 FASO CLOUD Free
        </p>
      </footer>
    </main>
  );
}
