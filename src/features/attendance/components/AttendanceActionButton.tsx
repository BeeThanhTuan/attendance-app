import { LogIn, LogOut } from "lucide-react";

interface Props {
  type: "check-in" | "check-out";
  disabled?: boolean;
  onClick(): void;
}

export default function AttendanceActionButton({
  type,
  disabled,
  onClick,
}: Props) {
  const checkIn = type === "check-in";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex h-13 w-full items-center justify-center gap-2.5 rounded-4xl text-base font-semibold text-white transition-all active:scale-[0.98] ${checkIn
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-rose-600 hover:bg-rose-700"
        } disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`}
    >
      {checkIn ? (
        <>
          <LogIn size={20} className="text-white" />
          <span>Chấm công Vào</span>
        </>
      ) : (
        <>
          <LogOut size={20} className="text-white" />
          <span>Chấm công Ra</span>
        </>
      )}
    </button>
  );
}

