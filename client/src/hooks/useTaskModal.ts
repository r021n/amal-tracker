import { useMemo, useState } from "react";

import dayjs from "../lib/dayjs";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";

import { sedekahOptions, sholatItems } from "../components/TaskModal/constants";

export function useTaskModal() {
  const today = useTaskStore(useShallow((state) => state.getToday()));
  const setSholatStatus = useTaskStore((state) => state.setSholatStatus);
  const setAllSholat = useTaskStore((state) => state.setAllSholat);
  const toggleDzikir = useTaskStore((state) => state.toggleDzikir);
  const setAllDzikir = useTaskStore((state) => state.setAllDzikir);
  const setQuranPages = useTaskStore((state) => state.setQuranPages);
  const toggleQuran = useTaskStore((state) => state.toggleQuran);
  const setSedekahAmount = useTaskStore((state) => state.setSedekahAmount);
  const toggleSedekah = useTaskStore((state) => state.toggleSedekah);
  const addCustom = useTaskStore((state) => state.addCustom);
  const toggleCustom = useTaskStore((state) => state.toggleCustom);
  const removeCustom = useTaskStore((state) => state.removeCustom);

  const [customName, setCustomName] = useState("");
  const [isSholatExpanded, setSholatExpanded] = useState(false);
  const [isDzikirExpanded, setDzikirExpanded] = useState(false);
  const [isQuranExpanded, setQuranExpanded] = useState(false);
  const [isSedekahExpanded, setSedekahExpanded] = useState(false);
  const [isCustomExpanded, setCustomExpanded] = useState(false);

  const sholatDoneCount = useMemo(
    () => sholatItems.filter((item) => today.sholat[item.k] !== "none").length,
    [today.sholat],
  );

  const customDoneCount = useMemo(
    () => today.custom.filter((item) => item.done).length,
    [today.custom],
  );

  const isQuranChecked = today.quran.pages > 0 && today.quran.done;
  const isSedekahChecked = today.sedekah.amount > 0 && today.sedekah.done;

  const totalChecklist = 9 + today.custom.length;
  const doneChecklist =
    sholatDoneCount +
    Number(today.dzikirPagi) +
    Number(today.dzikirPetang) +
    Number(isQuranChecked) +
    Number(isSedekahChecked) +
    customDoneCount;

  const progressPercent = Math.round(
    (doneChecklist / Math.max(1, totalChecklist)) * 100,
  );

  const hijriDate = dayjs().calendar("hijri").format("D MMMM YYYY [H]");
  const gregorianDate = dayjs().format("D MMM YYYY");

  const toggleAllSholat = () => {
    if (sholatDoneCount === sholatItems.length) {
      setAllSholat("none");
      return;
    }

    setAllSholat("done");
  };

  const toggleAllDzikir = () => {
    const bothDone = today.dzikirPagi && today.dzikirPetang;
    setAllDzikir(!bothDone);
  };

  const addCustomItem = () => {
    const trimmedName = customName.trim();
    if (!trimmedName) return;

    addCustom(trimmedName);
    setCustomName("");
  };

  return {
    today,
    customName,
    setCustomName,
    isSholatExpanded,
    setSholatExpanded,
    isDzikirExpanded,
    setDzikirExpanded,
    isQuranExpanded,
    setQuranExpanded,
    isSedekahExpanded,
    setSedekahExpanded,
    isCustomExpanded,
    setCustomExpanded,
    sholatDoneCount,
    customDoneCount,
    isQuranChecked,
    isSedekahChecked,
    totalChecklist,
    doneChecklist,
    progressPercent,
    hijriDate,
    gregorianDate,
    setSholatStatus,
    toggleAllSholat,
    toggleDzikir,
    toggleAllDzikir,
    setQuranPages,
    toggleQuran,
    setSedekahAmount,
    toggleSedekah,
    addCustomItem,
    toggleCustom,
    removeCustom,
    sholatItems,
    sedekahOptions,
  };
}