import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

type Gender = "L" | "P" | "";

export default function Profile() {
  const {
    name,
    pin,
    gender,
    targetSedekah,
    targetQuran,
    updateProfile,
    logout,
    isAuthenticated,
  } = useUserStore();
  const [form, setForm] = useState({
    name: name ?? "",
    pin: pin ?? "",
    gender: (gender as Gender) ?? "",
    targetSedekah: targetSedekah ?? 0,
    targetQuran: targetQuran ?? 0,
  });
  const navigate = useNavigate();

  const save = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(form);
    if (!isAuthenticated && form.pin) logout();
    navigate(form.pin ? "/login" : "/");
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-24">
      <h1 className="text-xl font-semibold">Profile</h1>
      <form onSubmit={save} className="space-y-3">
        <input
          className="w-full border p-3 rounded"
          placeholder="Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border p-3 rounded"
          type="password"
          placeholder="PIN"
          value={form.pin}
          onChange={(e) => setForm({ ...form, pin: e.target.value })}
        />
        <select
          className="w-full border p-3 rounded"
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as Gender })
          }
        >
          <option value="">Pilih gender</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <div>
          <label className="text-sm">Target sedekah mingguan</label>
          <input
            type="number"
            className="w-full border p-3 rounded"
            value={form.targetSedekah}
            onChange={(e) =>
              setForm({ ...form, targetSedekah: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="text-sm">Target halaman Quran harian</label>
          <input
            type="number"
            className="w-full border p-3 rounded"
            value={form.targetQuran}
            onChange={(e) =>
              setForm({ ...form, targetQuran: Number(e.target.value) })
            }
          />
        </div>
        <button className="w-full bg-black text-white p-3 rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}
