import { api } from "@/lib/axios";

export async function registerFace(formData: FormData) {
  const { data } = await api.post(
    "/employees/me/face",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function reRegisterFace(formData: FormData) {
  const { data } = await api.put(
    "/employees/me/face",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}