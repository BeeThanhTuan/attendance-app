interface StatBoxProps {
  value: number;
  label: string;
  type: "total" | "pending" | "confirmed";
}

export function StatBox({ value, label, type }: StatBoxProps) {
  const styles = {
    total: {
      wrapper: "bg-slate-50",
      value: "text-blue-500",
      label: "text-blue-400",
    },

    pending: {
      wrapper: "bg-slate-50",
      value: "text-amber-500",
      label: "text-amber-400",
    },

    confirmed: {
      wrapper: "bg-slate-50",
      value: "text-emerald-500",
      label: "text-emerald-400",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        flex
        min-h-[48px]
        flex-col
        items-center
        justify-center
        rounded-xl
        ${style.wrapper}
      `}
    >
      <span
        className={`
          text-base
          font-bold
          leading-none
          ${style.value}
        `}
      >
        {value}
      </span>

      <span
        className={`
          mt-1
          text-[10px]
          font-medium
          ${style.label}
        `}
      >
        {label}
      </span>
    </div>
  );
}
