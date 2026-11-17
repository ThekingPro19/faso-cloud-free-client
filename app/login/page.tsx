
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function login(e: React.FormEvent<HTMLFormElement>) {
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

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage("Connexion impossible. Vérifiez vos identifiants.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setMessage("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>FASO CLOUD Free</h1>

      <section className="card">
        <h2>Connexion</h2>

        <form onSubmit={login}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p>
            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </p>
        </form>

        <p role="status">{message}</p>

        <p>
          Pas encore de compte ?{" "}
          <Link href="/register">S'inscrire</Link>
        </p>
      </section>
    </main>
  );
      }
