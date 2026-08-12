import { useQuery } from '@tanstack/react-query';
import { getLocations } from '@/lib/api/location.api';
export function useLocations(){
    return useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,

    // khi quay lại tab sẽ tự lấy profile mới
    refetchOnWindowFocus: true,

    // khi reconnect mạng cũng lấy lại
    refetchOnReconnect: true,
  });
}