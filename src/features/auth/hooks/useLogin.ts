import { loginApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: loginApi,

    onSuccess(data) {
      login(data.access_token);
    },
  });
}
