import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  name: string;
  pin: string;
  gender: "" | "L" | "P";
  targetSedekah: number;
  targetQuran: number;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  updateProfile: (
    data: Partial<
      Pick<
        UserState,
        "name" | "pin" | "gender" | "targetSedekah" | "targetQuran"
      >
    >,
  ) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      pin: "",
      gender: "",
      targetSedekah: 50000,
      targetQuran: 2,
      isAuthenticated: false,
      login: (pin) => {
        const ok = get().pin !== "" && get().pin === pin;
        if (ok) set({ isAuthenticated: true });
        return ok;
      },
      logout: () => set({ isAuthenticated: false }),
      updateProfile: (data) => set({ ...data }),
    }),
    { name: "amal-user" },
  ),
);
