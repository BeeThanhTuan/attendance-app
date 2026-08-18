import type { Profile } from "@/features/profile/types/profile.types";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { getImageUrl } from "@/lib/utils/image";

interface HomeHeaderProps {
  profile: Profile;
}

export default function HomeHeader({ profile }: HomeHeaderProps) {
  const avatarUrl = profile.face?.avatar_url
    ? getImageUrl(profile.face.avatar_url)
    : avatarPlaceholder;
  const subInfo = [profile.employee_code, profile.department]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 pt-7 px-5 pb-16 text-white relative">
      <div className="flex items-center justify-between">
        {/* User Avatar & Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={profile.full_name}
              className="size-14 rounded-full object-cover border-2 border-white "
            />
          </div>

          <div>
            <p className="text-md font-medium text-blue-100">Xin chào, <span className="text-base animate-bounce">👋</span></p>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 mt-0.5">
              <span>{profile.full_name}</span>
            </h1>
            {subInfo && (
              <p className="text-sm font-medium text-blue-100 mt-0.5">
                {subInfo}
              </p>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
