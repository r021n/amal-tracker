import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

export default function Login() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const login = useUserStore((s) => s.login);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const pinStored = useUserStore((s) => s.pin);

  const navigate = useNavigate();

  if (!pinStored) return <Navigate to="/profile" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const ok = login(pin.trim());
    if (ok) {
      navigate("/", { replace: true });
    } else {
      setError("PIN salah");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Masuk dengan PIN</h1>

        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="PIN"
          autoFocus
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
