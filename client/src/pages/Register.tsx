import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = useUserStore((s) => s.register);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password tidak boleh kosong");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    try {
      await register(username.trim(), password.trim());
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal mendaftar");
      } else {
        setError("Gagal mendaftar");
      }
    }
  };

  return (
    <div className="p-8 pb-24 space-y-5 max-w-md mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-left">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Buat Akun Baru
        </p>
        <h1 className="text-4xl font-black text-black tracking-tighter mt-1">
          Daftar
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Buat akun untuk mulai melacak ibadah harianmu.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-[26px] border-2 border-black bg-stone-50 p-5 space-y-4"
      >
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
            className="mt-2 w-full rounded-xl border-2 border-black/20 bg-stone-50 px-4 py-3 font-medium text-black outline-none transition-colors focus:border-black/50"
            placeholder="Pilih username"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-black/20 bg-stone-50 px-4 py-3 font-medium text-black outline-none transition-colors focus:border-black/50"
            placeholder="Buat password"
          />
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-4">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-black/20 bg-stone-50 px-4 py-3 font-medium text-black outline-none transition-colors focus:border-black/50"
            placeholder="Ulangi password"
          />
        </div>

        {error && (
          <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl border-2 border-black bg-black px-4 py-4 text-base font-bold text-white mt-2 active:scale-95 transition-transform"
        >
          Daftar Sekarang
        </button>

        <p className="mt-4 text-center text-sm font-medium text-gray-600">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-bold text-black underline underline-offset-4 outline-none hover:text-gray-700"
          >
            Masuk
          </button>
        </p>
      </form>
    </div>
  );
}
