import {
  CheckCircle2,
  Crosshair,
  Navigation,
  XCircle,
} from "lucide-react";

interface Props {
  distance: number | null;
  radius: number | null;
  accuracy: number | null;
  latitude: number | null;
  longitude: number | null;
  isWithinRadius: boolean;
}

function formatDist(value: number | null): string {
  if (value === null) return "--";
  const v = Math.max(0, value);
  return v < 10 ? v.toFixed(1) : Math.round(v).toString();
}

export default function LocationStatusCard({
  distance,
  radius,
  accuracy,
  isWithinRadius,
}: Props) {
  return (
    <div
      className={`shrink-0 rounded-2xl p-4 border border-slate-200 bg-white transition-colors ${
        isWithinRadius
          ? "bg-emerald-50 ring-emerald-200"
          : "bg-white ring-slate-100"
      }`}
    >
      {/* ── Status badge ── */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 text-sm font-semibold ${
            isWithinRadius ? "text-emerald-700" : "text-slate-500"
          }`}
        >
          {isWithinRadius ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} className="text-red-400" />
          )}
          <span>
            {isWithinRadius ? "Bạn trong phạm vi chấm công" : "Bạn ngoài phạm vi chấm công"}
          </span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="mt-3 grid grid-cols-3 divide-x divide-slate-100">
        {/* Distance */}
        <div className="flex flex-col items-center gap-0.5 pr-3">
          <Navigation size={14} className="text-slate-400" />
          <p className="text-xl font-bold text-slate-800 leading-none">
            {formatDist(distance)}
            <span className="text-xs font-semibold text-slate-400 ml-0.5">m</span>
          </p>
          <p className="text-[12px] text-slate-400">Khoảng cách</p>
        </div>

        {/* Radius */}
        <div className="flex flex-col items-center gap-0.5 px-3">
          <Crosshair size={14} className="text-slate-400" />
          <p className="text-xl font-bold text-slate-800 leading-none">
            {radius ?? "--"}
            {radius !== null && (
              <span className="text-xs font-semibold text-slate-400 ml-0.5">m</span>
            )}
          </p>
          <p className="text-[12px] text-slate-400">Phạm vi</p>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-0.5 pl-3">
          <Crosshair size={14} className="text-slate-400" />
          <p className="text-xl font-bold text-slate-800 leading-none">
            {accuracy !== null ? (
              <>
                ±{Math.round(accuracy)}
                <span className="text-xs font-semibold text-slate-400 ml-0.5">m</span>
              </>
            ) : (
              "--"
            )}
          </p>
          <p className="text-[12px] text-slate-400">Độ chính xác</p>
        </div>
      </div>
    </div>
  );
}