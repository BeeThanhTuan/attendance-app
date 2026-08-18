import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface MonthYearPickerProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthYearPicker({
  year,
  month,
  onChange,
}: MonthYearPickerProps) {
  const goPrevious = () => {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };

  const goNext = () => {
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-slate-100 bg-white px-4">
      <button
        type="button"
        onClick={goPrevious}
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-full
          text-slate-500
          transition
          active:scale-90
        "
      >
        <ChevronLeft size={19} />
      </button>

      <button
        type="button"
        className="
          flex items-center gap-2
          text-sm font-semibold
          text-slate-700
        "
      >
        <CalendarDays size={16} className="text-slate-500" />

        <span>
          Tháng {String(month).padStart(2, "0")}/{year}
        </span>
      </button>

      <button
        type="button"
        onClick={goNext}
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-full
          text-slate-500
          transition
          active:scale-90
        "
      >
        <ChevronRight size={19} />
      </button>
    </div>
  );
}
