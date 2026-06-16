import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin");
    });
  }, [navigate]);

  async function signIn() {
    setError("");
    if (!isSupabaseConfigured) {
      setError("Connect Supabase first (see README), then create your owner account.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/admin");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <p className="display mb-1 text-center text-3xl font-extrabold lowercase">
          brika<span className="text-azur">.</span>
        </p>
        <p className="mb-8 text-center text-sm text-muted">Owner dashboard</p>

        <div className="rounded-2xl border border-line bg-white p-7">
          <label className="label">Email</label>
          <input
            className="field mb-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
            placeholder="you@brika.store"
          />
          <label className="label">Password</label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
            placeholder="••••••••"
          />
          {error && <p className="mt-4 text-sm text-azur-dark">{error}</p>}
          <button onClick={signIn} disabled={busy} className="btn-primary mt-6 w-full">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
        <p className="mt-5 text-center text-xs text-muted">
          Create your account in Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
