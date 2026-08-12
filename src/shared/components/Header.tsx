import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  fallbackUrl?: string;
  right?: React.ReactNode;
}

export default function AppHeader({
  title,
  showBack = true,
  onBack,
  fallbackUrl = "/",
  right,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // Check if browser has navigation history in current SPA session
    const canGoBack = window.history.state && window.history.state.idx > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      // Fallback safely to specified URL or homepage if opened directly/refreshed
      navigate(fallbackUrl, { replace: true });
    }
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        shrink-0
        items-center
        justify-between
        h-16
        px-4
        text-white
        bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600
        
      "
    >
      {/* Left */}
      <div className="w-10 flex justify-start">
        {showBack && (
          <button
            onClick={handleBack}
            aria-label="Quay lại"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white/15
              text-white
              backdrop-blur-md
              transition-all
              hover:bg-white/25
              active:scale-95
            "
          >
            <Undo2 className="size-5" />
          </button>
        )}
      </div>

      {/* Center */}
      <h1
        className="
          flex-1
          px-3
          truncate
          text-center
          text-lg
          font-semibold
          tracking-wide
          text-white
        "
      >
        {title}
      </h1>

      {/* Right */}
      <div className="flex w-10 justify-end">{right}</div>
    </header>
  );
}
