import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useUserStore((s) => s.login);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const passwordStored = useUserStore((s) => s.password);

  const navigate = useNavigate();

  if (!passwordStored) return <Navigate to="/profile" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const ok = login(password.trim());
    if (ok) {
      navigate("/", { replace: true });
    } else {
      setError("Password salah");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md">
        <form
          onSubmit={submit}
          className="overflow-hidden rounded-[28px] border-2 border-black bg-white"
        >
          <div className="border-b-2 border-black px-5 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Keamanan Akun
            </p>
            <h1 className="mt-2 text-3xl font-black leading-none">Masuk</h1>
            <p className="mt-2 text-sm text-gray-600">
              Masukkan password untuk lanjut ke tracker ibadah harianmu.
            </p>
          </div>

          <div className="space-y-4 bg-stone-50 p-4">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border-2 border-black/70 bg-white px-4 py-3 text-base font-medium outline-none"
                placeholder="Masukkan password"
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500">
                Password ini dipakai untuk melindungi akses ke aplikasi.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl border-2 border-black bg-black px-4 py-3 text-base font-bold text-white"
            >
              Masuk Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
