interface Props {
  disabled?: boolean;

  onClick(): void;
}

export default function ContinueButton({
  disabled,
  onClick,
}: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="h-14 w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-base font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:opacity-50"
    >
      Tiếp tục
    </button>
  );
}