import { useEffect, useRef, useState } from "react";

/** Detect thiết bị mobile qua user-agent + màn hình nhỏ */
function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const smallScreen = window.innerWidth <= 768;
  return mobileUA || smallScreen;
}

/** Detect hệ điều hành iOS (iPhone/iPad) */
function checkIsIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua);
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface UsePWAInstallReturn {
  /** Có thể trigger prompt cài đặt trực tiếp không (Android Chrome HTTPS) */
  canInstall: boolean;
  /** Là thiết bị di động hay không */
  isMobile: boolean;
  /** Là iOS (iPhone/iPad) hay không */
  isIOS: boolean;
  /** Đã cài đặt PWA hoặc đang mở trong ứng dụng chưa */
  isInstalled: boolean;
  /** Trigger dialog cài đặt native của Chrome */
  promptInstall: () => Promise<void>;
}

export function usePWAInstall(): UsePWAInstallReturn {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Kiểm tra xem ứng dụng đã chạy dưới dạng PWA Standalone chưa
  const isInstalled =
    (typeof window !== "undefined" &&
      window.matchMedia?.("(display-mode: standalone)")?.matches === true) ||
    (typeof window !== "undefined" && (window.navigator as any).standalone === true);

  useEffect(() => {
    setIsMobile(checkIsMobile());
    setIsIOS(checkIsIOS());
  }, []);

  useEffect(() => {
    if (isInstalled) return;

    const handler = (e: Event) => {
      // Chặn popup mặc định của browser để hiển thị banner tùy chỉnh
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isInstalled]);

  useEffect(() => {
    const handler = () => setCanInstall(false);
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const result = await deferredPrompt.current.userChoice;
    if (result.outcome === "accepted") {
      deferredPrompt.current = null;
      setCanInstall(false);
    }
  };

  return { canInstall, isMobile, isIOS, isInstalled, promptInstall };
}

