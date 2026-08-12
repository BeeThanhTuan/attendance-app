import type { Locations } from "@/features/attendance/types/location.types";
import { api } from "@/lib/axios";

export const getLocations = async (): Promise<Locations[]> => {
  const { data } = await api.get<Locations[]>("/locations");
  return data;
};