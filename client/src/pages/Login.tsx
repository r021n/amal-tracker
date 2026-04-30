import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useUserStore((s) => s.login);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const ok = await login(username.trim(), password.trim());
      if (ok) {
        navigate("/", { replace: true });
      } else {
        setError("Username atau password salah");
      }
    } catch {
      setError("Terjadi kesalahan pada server");
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
              Selamat Datang Kembali
            </p>
            <h1 className="mt-2 text-3xl font-black leading-none">Masuk</h1>
            <p className="mt-2 text-sm text-gray-600">
              Masukkan username dan password untuk lanjut ke tracker ibadah
              harianmu.
            </p>
          </div>

          <div className="space-y-4 bg-stone-50 p-4">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <label
                htmlFor="username"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-xl border-2 border-black/70 bg-white px-4 py-3 text-base font-medium outline-none"
                placeholder="Masukkan username"
                autoFocus
              />
            </div>

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
              />
            </div>

            {error && (
              <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl border-2 border-black bg-black px-4 py-3 text-base font-bold text-white transition-transform active:scale-95"
            >
              Masuk Sekarang
            </button>

            <p className="mt-4 text-center text-sm font-medium text-gray-600">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-bold text-black underline underline-offset-4 outline-none hover:text-gray-700"
              >
                Daftar
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
