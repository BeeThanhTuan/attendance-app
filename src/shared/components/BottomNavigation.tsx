import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api/profile.api";
import { ROLE, type Role } from "@/shared/types/role";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface IconProps {
  active: boolean;
}

interface NavItemConfig {
  label: string;
  Icon: React.ComponentType<IconProps>;
  to: string;
  roles?: Role[];
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────

function HomeIcon({ active }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke={active ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H15v-5.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V21H4a1 1 0 0 1-1-1V10.5z" />
    </svg>
  );
}

function ScanIcon({ active }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />

      <circle
        cx="12"
        cy="12"
        r="3.5"
        fill={active ? "currentColor" : "none"}
        stroke={active ? "none" : "currentColor"}
        strokeWidth="1.8"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Xác nhận công
// ─────────────────────────────────────────────

function CheckIcon({ active }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke={active ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.5" />

      <path
        d="M8 12.5l2.5 2.5L16.5 9"
        fill="none"
        stroke={active ? "white" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ active }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke={active ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.5" />

      <polyline
        points="12 7 12 12 15 14.5"
        fill="none"
        stroke={active ? "white" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonIcon({ active }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke={active ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7.5" r="3.5" />

      <path d="M4 21v-1.5A5.5 5.5 0 0 1 9.5 14h5A5.5 5.5 0 0 1 20 19.5V21" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Navigation items
// ─────────────────────────────────────────────

const items: NavItemConfig[] = [
  {
    label: "Trang chủ",
    Icon: HomeIcon,
    to: "/home",
  },
  {
    label: "Chấm công",
    Icon: ScanIcon,
    to: "/attendance",
  },
  {
    label: "Xác nhận công",
    Icon: CheckIcon,
    to: "/attendance-confirmation",
    roles: [ROLE.ADMIN, ROLE.MANAGER],
  },
  {
    label: "Lịch sử",
    Icon: ClockIcon,
    to: "/history",
  },
  {
    label: "Tôi",
    Icon: PersonIcon,
    to: "/profile",
  },
];

// ─────────────────────────────────────────────
// Ripple
// ─────────────────────────────────────────────

let uid = 0;

function NavItem({
  item,
}: {
  item: NavItemConfig;
}) {
  const [ripples, setRipples] = useState<number[]>([]);

  const Icon = item.Icon;

  const spawnRipple = () => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // noop
      }
    }

    const id = ++uid;

    setRipples((prev) => [...prev, id]);

    setTimeout(() => {
      setRipples((prev) =>
        prev.filter((rippleId) => rippleId !== id)
      );
    }, 450);
  };

  return (
    <NavLink
      to={item.to}
      className="block h-full"
      onClick={spawnRipple}
    >
      {({ isActive }) => (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden select-none">
          {/* Icon */}
          <div className="relative flex size-8 items-center justify-center">
            <AnimatePresence>
              {ripples.map((id) => (
                <motion.span
                  key={id}
                  className="pointer-events-none absolute rounded-full bg-blue-500/20"
                  style={{
                    width: 32,
                    height: 32,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0.5,
                  }}
                  animate={{
                    scale: 3.5,
                    opacity: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </AnimatePresence>

            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                color: isActive
                  ? "#2563eb"
                  : "#64748b",
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="z-10 flex items-center justify-center"
            >
              <Icon active={isActive} />
            </motion.div>
          </div>

          {/* Label */}
          <span
            className={`mt-0.5 text-[11px] truncate leading-tight transition-colors duration-200 ${
              isActive
                ? "text-blue-600"
                : "text-slate-500"
            }`}
          >
            {item.label}
          </span>
        </div>
      )}
    </NavLink>
  );
}

// ─────────────────────────────────────────────
// Bottom Navigation
// ─────────────────────────────────────────────

export default function BottomNavigation() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // Trong lúc chưa lấy được profile,
  // không hiển thị nút dành riêng cho manager/admin.
  const role = profile?.role

  const visibleItems = items.filter((item) => {
    // Menu bình thường
    if (!item.roles) {
      return true;
    }

    // Menu dành riêng cho role
    return item.roles.includes(role);
  });

  // Tránh layout nhảy từ 4 -> 5 item
  // trong lúc profile đang loading.
  if (isLoading) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] select-none border-t border-slate-100 bg-white/95 shadow-[0_-1px_4px_rgba(0,0,0,0.04)] backdrop-blur-md">
        <nav className="grid grid-cols-4 items-center pb-4 pt-1">
          {items
            .filter((item) => !item.roles)
            .map((item) => (
              <NavItem
                key={item.to}
                item={item}
              />
            ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] select-none border-t border-slate-100 bg-white/95 shadow-[0_-1px_4px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <nav
        className={`grid ${
          visibleItems.length === 5
            ? "grid-cols-5"
            : "grid-cols-4"
        } items-center pb-4 pt-1`}
      >
        {visibleItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
          />
        ))}
      </nav>
    </div>
  );
}