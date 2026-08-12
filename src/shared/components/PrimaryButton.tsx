import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}   