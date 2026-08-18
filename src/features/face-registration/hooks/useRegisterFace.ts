import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  registerFace,
  reRegisterFace,
} from "@/lib/api/faceRegistration.api";

export type FaceRegistrationMode =
  | "register"
  | "reregister";

export type RegisterStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error";

export function useRegisterFace(
  mode: FaceRegistrationMode = "register",
) {
  const queryClient = useQueryClient();

  const [status, setStatus] =
    useState<RegisterStatus>("idle");

  const [error, setError] =
    useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      mode === "register"
        ? registerFace(formData)
        : reRegisterFace(formData),

    onMutate() {
      setStatus("uploading");
      setError(null);
    },

    onSuccess() {
      setStatus("success");
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },

    onError(error: any) {
      setStatus("error");

      setError(
        error?.response?.data?.detail ??
          (mode === "register"
            ? "Đăng ký khuôn mặt thất bại."
            : "Đăng ký lại khuôn mặt thất bại."),
      );
    },
  });

  return {
    upload: mutation.mutate,
    status,
    error,
  };
}