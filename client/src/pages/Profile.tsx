import { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useUserStore } from "../store/useUserStore";
import { UserIcon } from "../assets/profile/UserIcon";
import { LockIcon } from "../assets/profile/LockIcon";
import { GenderIcon } from "../assets/profile/GenderIcon";
import { ChevronDownIcon } from "../assets/profile/ChevronDownIcon";

export default function Profile() {
  const {
    name,
    password,
    gender,
    targetSedekah,
    targetQuran,
    updateProfile,
    logout,
  } = useUserStore();
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [form, setForm] = useState({
    name,
    password,
    gender,
    targetSedekah,
    targetQuran,
  });
  const navigate = useNavigate();

  const save = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordChanged = form.password !== password;
    updateProfile(form);
    if (passwordChanged) {
      logout();
      navigate("/login");
      return;
    }

    navigate("/");
  };

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-md space-y-5 p-4 pb-24">
      <div className="px-5 py-5">
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

      <form onSubmit={save} className="space-y-4 p-4">
        <div className="rounded-2xl border-2 border-black bg-white p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Nama Panggilan
            </label>
            <UserIcon className="h-6 w-6" />
          </div>
          <input
            id="name"
            className="mt-2 w-full rounded-xl border-2 border-black/20 bg-stone-50 px-4 py-3 font-medium text-black outline-none transition-colors focus:border-black/50"
            placeholder="Masukkan nama panggilan"
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
                Ubah password akun Anda untuk menjaga keamanan.
              </p>
            </div>
            <LockIcon className="h-7 w-7" />
          </div>

          <input
            id="password"
            className="mt-3 w-full rounded-xl border-2 border-black/20 bg-stone-50 px-4 py-3 font-medium text-black outline-none transition-colors focus:border-black/50"
            type="password"
            autoComplete="new-password"
            placeholder="Buat password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="gender"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Gender
            </label>
            <GenderIcon className="h-6 w-6" />
          </div>
          <div className="relative mt-2">
            <button
              type="button"
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className="flex w-full items-center justify-between rounded-xl border-2 border-black/20 bg-stone-50 pl-4 pr-5 py-3 font-medium text-black outline-none transition-colors focus:border-black/50"
            >
              <span>
                {form.gender === "L"
                  ? "Laki-laki"
                  : form.gender === "P"
                    ? "Perempuan"
                    : "Pilih gender"}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 text-black/50 transition-transform ${isGenderOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isGenderOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border-2 border-black bg-white"
                >
                  <div
                    onClick={() => {
                      updateField("gender", "");
                      setIsGenderOpen(false);
                    }}
                    className="cursor-pointer p-4 transition-colors hover:bg-stone-100"
                  >
                    <p className="font-medium text-gray-400">Pilih gender</p>
                  </div>
                  <div
                    onClick={() => {
                      updateField("gender", "L");
                      setIsGenderOpen(false);
                    }}
                    className={`cursor-pointer p-4 transition-colors hover:bg-stone-100 ${form.gender === "L" ? "bg-stone-50" : ""}`}
                  >
                    <p className="font-bold text-black">Laki-laki</p>
                  </div>
                  <div
                    onClick={() => {
                      updateField("gender", "P");
                      setIsGenderOpen(false);
                    }}
                    className={`cursor-pointer p-4 transition-colors hover:bg-stone-100 ${form.gender === "P" ? "bg-stone-50" : ""}`}
                  >
                    <p className="font-bold text-black">Perempuan</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

          <div className="rounded-2xl border-2 border-black/10 bg-stone-50 p-4">
            <label
              htmlFor="targetSedekah"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Target sedekah mingguan
            </label>

            <div className="mt-2 flex h-12 items-stretch overflow-hidden rounded-xl border-2 border-black/15 bg-white py-1 pl-4 pr-4 transition-colors focus-within:border-black/40">
              <input
                id="targetSedekah"
                type="number"
                className="h-full min-w-0 flex-1 bg-transparent pr-2 font-medium text-black outline-none"
                value={form.targetSedekah}
                onChange={(e) =>
                  updateField(
                    "targetSedekah",
                    Math.max(0, Number(e.target.value)),
                  )
                }
              />
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "targetSedekah",
                      Math.max(0, form.targetSedekah - 1000),
                    )
                  }
                  className="flex h-full w-9 items-center justify-center rounded-lg bg-black text-xl font-bold text-white active:scale-95"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateField("targetSedekah", form.targetSedekah + 1000)
                  }
                  className="flex h-full w-9 items-center justify-center rounded-lg bg-black text-xl font-bold text-white active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-black/10 bg-stone-50 p-4">
            <label
              htmlFor="targetQuran"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Target halaman Quran harian
            </label>

            <div className="mt-2 flex h-12 items-stretch overflow-hidden rounded-xl border-2 border-black/15 bg-white py-1 pl-4 pr-4 transition-colors focus-within:border-black/40">
              <input
                id="targetQuran"
                type="number"
                className="h-full min-w-0 flex-1 bg-transparent pr-2 font-medium text-black outline-none"
                value={form.targetQuran}
                onChange={(e) =>
                  updateField(
                    "targetQuran",
                    Math.max(0, Number(e.target.value)),
                  )
                }
              />
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "targetQuran",
                      Math.max(0, form.targetQuran - 1),
                    )
                  }
                  className="flex h-full w-9 items-center justify-center rounded-lg bg-black text-xl font-bold text-white active:scale-95"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateField("targetQuran", form.targetQuran + 1)
                  }
                  className="flex h-full w-9 items-center justify-center rounded-lg bg-black text-xl font-bold text-white active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full rounded-2xl border-2 border-black bg-black p-3 text-base font-bold text-white">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
