
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url || !key) {
      setError("Configuration Supabase manquante.");
      setLoading(false);
      return;
    }

    const supabase = createClient(url, key);

    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setEmail(data.user.email || "");
      setLoading(false);
    }

    void checkUser();
  }, [router]);

  async function logout() {
    if (!url || !key) return;

    const supabase = createClient(url, key);
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="container">
        <p>{error || "Vérification du compte..."}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>FASO CLOUD Free</h1>
      <p className="muted">Tableau de bord client</p>

      <section className="card">
        <h2>Bienvenue</h2>
        <p>Compte : {email}</p>
        <p>Statut : compte connecté</p>
      </section>

      <section className="card">
        <h2>Minage Bitcoin</h2>
        <p>Statut : non activé</p>
        <p>
          Aucun fournisseur de minage réel
          n'est encore connecté.
        </p>
      </section>

      <section className="card">
        <h2>Récompenses et retraits</h2>
        <p>
          Aucun solde BTC confirmé.
          Les retraits ne sont pas activés.
        </p>
      </section>

      <section className="card">
        <h2>Mon compte</h2>
        <p>
          <Link href="/">Retour à l'accueil</Link>
        </p>
        <button onClick={logout}>
          Se déconnecter
        </button>
      </section>
    </main>
  );
            }
