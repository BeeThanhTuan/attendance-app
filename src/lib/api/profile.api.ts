import type { Profile } from "@/features/profile/types/profile.types";
import {api} from "@/lib/axios";

export const getProfile = async () => {
  const { data } = await api.get<Profile>("/profile/me");
  return data;
};