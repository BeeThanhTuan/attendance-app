interface Props {
  steps: string[];
  currentStep: number;
}

export default function AttendanceStepper({ steps, currentStep }: Props) {
  if (steps.length === 0) {
    return null;
  }

  const connectorOffset = `${100 / (steps.length * 2)}%`;

  return (
    <div className="w-full rounded-t-3xl bg-white">
      <div className="relative">
        {/* Connector */}
        {steps.length > 1 && (
          <div
            className="absolute top-[18px] z-0 h-[2px] bg-slate-200"
            style={{
              left: connectorOffset,
              right: connectorOffset,
            }}
          >
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width:
                  currentStep <= 0
                    ? "0%"
                    : `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        )}

        {/* Steps */}
        <div
          className="relative z-10 grid w-full"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          }}
        >
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPassed = index <= currentStep;

            return (
              <div
                key={`${step}-${index}`}
                className="flex min-w-0 flex-col items-center"
              >
                {/* Circle */}
                <div
                  className={[
                    "flex size-9 shrink-0 items-center justify-center",
                    "rounded-full text-sm font-bold",
                    "transition-all duration-300",
                    isPassed
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-500",
                    isActive ? "ring-4 ring-blue-100" : "",
                  ].join(" ")}
                >
                  {index + 1}
                </div>

                {/* Label */}
                <span
                  className={[
                    "mt-2 px-1 text-center text-xs leading-4",
                    "whitespace-nowrap",
                    isPassed ? "font-semibold text-primary" : "text-slate-400",
                  ].join(" ")}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
