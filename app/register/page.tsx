
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setMessage("Configuration Supabase manquante.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient(url, key);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Demande reçue. Vérifiez votre e-mail pour confirmer votre compte."
        );
      }
    } catch {
      setMessage("Une erreur de connexion est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>FASO CLOUD Free</h1>

      <section className="card">
        <h2>Créer un compte</h2>

        <form onSubmit={register}>
          <p>Adresse e-mail</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p>Mot de passe</p>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p>
            <button type="submit" disabled={loading}>
              {loading ? "Patientez..." : "S'inscrire"}
            </button>
          </p>
        </form>

        <p role="status">{message}</p>

        <p>
          Déjà inscrit ? <Link href="/login">Connexion</Link>
        </p>
      </section>
    </main>
  );
}
