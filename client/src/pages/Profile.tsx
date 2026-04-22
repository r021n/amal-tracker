import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

type Gender = "L" | "P" | "";

export default function Profile() {
  const {
    name,
    password,
    gender,
    targetSedekah,
    targetQuran,
    updateProfile,
    logout,
    isAuthenticated,
  } = useUserStore();
  const [form, setForm] = useState({
    name: name ?? "",
    password: password ?? "",
    gender: (gender as Gender) ?? "",
    targetSedekah: targetSedekah ?? 0,
    targetQuran: targetQuran ?? 0,
  });
  const navigate = useNavigate();

  const save = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordChanged = form.password !== password;
    updateProfile(form);
    if (passwordChanged) {
      logout();
      navigate(form.password ? "/login" : "/");
      return;
    }

    if (!isAuthenticated && form.password) {
      navigate("/login");
      return;
    }

    navigate("/");
  };

  const updateField = <K extends keyof typeof form,>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-md space-y-5 p-4 pb-24">
      <section className="overflow-hidden rounded-[28px] border-2 border-black bg-white">
        <div className="border-b-2 border-black px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Profil
          </p>
          <h1 className="mt-2 text-3xl font-black leading-none">
            Pengaturan Akun
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Atur identitas, target ibadah, dan keamanan akun dalam satu tempat.
          </p>
        </div>

        <form onSubmit={save} className="space-y-4 bg-stone-50 p-4">
          <div className="rounded-2xl border-2 border-black bg-white p-4">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Nama
            </label>
            <input
              id="name"
              className="mt-2 w-full rounded-xl border-2 border-black/70 px-4 py-3 font-medium outline-none"
              placeholder="Nama panggilan"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="rounded-2xl border-2 border-black bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Password
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Ganti sistem keamanan dari PIN ke password akun.
                </p>
              </div>
              <span className="rounded-full border-2 border-black bg-stone-100 px-3 py-1 text-[11px] font-semibold">
                Minimal 1 karakter
              </span>
            </div>
            <input
              id="password"
              className="mt-3 w-full rounded-xl border-2 border-black/70 px-4 py-3 font-medium outline-none"
              type="password"
              autoComplete="new-password"
              placeholder="Buat password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>

          <div className="rounded-2xl border-2 border-black bg-white p-4">
            <label
              htmlFor="gender"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Gender
            </label>
            <select
              id="gender"
              className="mt-2 w-full rounded-xl border-2 border-black/70 bg-white px-4 py-3 font-medium outline-none"
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value as Gender)}
            >
              <option value="">Pilih gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className="space-y-3 rounded-[26px] border-2 border-black bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold leading-none">
                  Target Harian
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Sesuaikan dengan ritme ibadah yang ingin dijaga.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-black bg-stone-50 p-4">
              <label
                htmlFor="targetSedekah"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Target sedekah mingguan
              </label>
              <input
                id="targetSedekah"
                type="number"
                className="mt-2 w-full rounded-xl border-2 border-black/70 bg-white px-4 py-3 font-medium outline-none"
                value={form.targetSedekah}
                onChange={(e) =>
                  updateField("targetSedekah", Number(e.target.value))
                }
              />
            </div>

            <div className="rounded-2xl border-2 border-black bg-stone-50 p-4">
              <label
                htmlFor="targetQuran"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Target halaman Quran harian
              </label>
              <input
                id="targetQuran"
                type="number"
                className="mt-2 w-full rounded-xl border-2 border-black/70 bg-white px-4 py-3 font-medium outline-none"
                value={form.targetQuran}
                onChange={(e) =>
                  updateField("targetQuran", Number(e.target.value))
                }
              />
            </div>
          </div>

          <button className="w-full rounded-2xl border-2 border-black bg-black p-3 text-base font-bold text-white">
            Simpan Perubahan
          </button>
        </form>
      </section>
    </div>
  );
}
