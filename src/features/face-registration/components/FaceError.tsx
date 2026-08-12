import { XCircle } from "lucide-react";

interface Props {
  error: string | null;
  onRetry: () => void;
}

export default function FaceErrorView({
  error,
  onRetry,
}: Props) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-slate-950 px-6">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white">
        <XCircle size={46} />
      </div>

      <h2 className="text-2xl font-bold text-white">
        Đăng ký thất bại
      </h2>

      <p className="mt-3 max-w-sm text-center text-red-300">
        {error}
      </p>

      <button
        onClick={onRetry}
        className="mt-8 w-full max-w-xs rounded-full bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500"
      >
        Thử lại
      </button>
    </div>
  );
}