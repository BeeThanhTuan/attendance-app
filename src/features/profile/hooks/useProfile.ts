import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/lib/api/profile.api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,

    // dữ liệu profile ít thay đổi
    staleTime: 1000 * 60 * 5,

    // cache giữ 10 phút sau khi không còn component dùng
    gcTime: 1000 * 60 * 10,

    retry: 1,

    // khi quay lại tab sẽ tự lấy profile mới
    refetchOnWindowFocus: true,

    // khi reconnect mạng cũng lấy lại
    refetchOnReconnect: true,
  });
}
