export const formatTimeString = (isoOrTimeString?: string | null): string => {
  if (!isoOrTimeString) return "--:--";
  try {
    if (isoOrTimeString.includes("T")) {
      const d = new Date(isoOrTimeString);
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }
    return isoOrTimeString.slice(0, 5);
  } catch {
    return isoOrTimeString.slice(0, 5);
  }
};

export const formatDateString = (
  isoOrDateString?: string | null
): string => {
  if (!isoOrDateString) return "--/--/----";

  try {
    if (isoOrDateString.includes("T")) {
      const d = new Date(isoOrDateString);

      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    // Nếu chỉ là YYYY-MM-DD
    const [year, month, day] = isoOrDateString.split("-");

    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }

    return isoOrDateString;
  } catch {
    return isoOrDateString;
  }
};

export const formatDateTime = (
  isoString: string | null,
): { date: string; time: string } => {
  if (!isoString) return { date: "—", time: "--:--" };
  const d = new Date(isoString);
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const date = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return { date, time };
};

export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

export const getTodayString = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};