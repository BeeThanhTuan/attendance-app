import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Locations } from "../types/location.types";
import { checkInApi } from "@/lib/api/attendance.api";
import { dataUrlToBlob } from "@/utils/dataUrlToBlob";

export function useCheckInFlow() {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [location, setLocation] = useState<Locations | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextLocation = useCallback((loc: Locations, lat: number, lng: number) => {
    setLocation(loc);
    setLatitude(lat);
    setLongitude(lng);
    setStep(1);
  }, []);

  const nextFace = useCallback((image: string) => {
    setFaceImage(image);
    setStep(2);
  }, []);

  const back = useCallback(() => {
    setSubmitError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const submit = useCallback(async () => {
    if (!location || latitude === null || longitude === null || !faceImage) {
      setSubmitError("Thiếu thông tin vị trí hoặc ảnh khuôn mặt.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append("location_id", location.id);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      const imageBlob = dataUrlToBlob(faceImage);
      formData.append("image", imageBlob, "checkin.jpg");

      await checkInApi(formData);

      // Refresh today's attendance query
      await queryClient.invalidateQueries({ queryKey: ["today-attendance"] });

      setIsSuccess(true);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      let message = "Chấm công thất bại. Vui lòng thử lại.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        message = detail[0]?.msg || "Dữ liệu gửi lên không hợp lệ.";
      }

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [location, latitude, longitude, faceImage, queryClient]);

  return {
    step,
    location,
    latitude,
    longitude,
    faceImage,
    isSubmitting,
    submitError,
    isSuccess,
    setLocation,
    nextLocation,
    nextFace,
    back,
    submit,
  };
}