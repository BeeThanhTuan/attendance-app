import { useMutation } from "@tanstack/react-query";
import { verifyFace } from "@/lib/api/attendance.api";
import { dataUrlToBlob } from "@/utils/dataUrlToBlob";

export function useVerifyFace() {
  const mutation = useMutation({
    mutationFn: async (faceImageBase64: string) => {
      const blob = dataUrlToBlob(faceImageBase64);
      const formData = new FormData();
      // FastAPI endpoint expects parameter name 'image' (image: UploadFile = File(...))
      formData.append("image", blob, "face.jpg");

      return await verifyFace(formData);
    },
  });

  let errorMessage: string | null = null;
  if (mutation.error) {
    const detail = (mutation.error as any)?.response?.data?.detail;
    if (typeof detail === "string") {
      errorMessage = detail;
    } else if (Array.isArray(detail) && detail.length > 0) {
      errorMessage = detail[0]?.msg || "Dữ liệu gửi lên không hợp lệ.";
    } else {
      errorMessage = "Xác thực khuôn mặt thất bại. Vui lòng thử lại.";
    }
  }

  return {
    verify: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: errorMessage,
    reset: mutation.reset,
  };
}
