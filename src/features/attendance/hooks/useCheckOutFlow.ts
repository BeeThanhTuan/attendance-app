import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Locations } from "../types/location.types";
import { useTodayAttendance } from "./useTodayAttendance";
import { useLocations } from "./useLocations";
import { checkOutApi } from "@/lib/api/attendance.api";
import { dataUrlToBlob } from "@/utils/dataUrlToBlob";

export function useCheckOutFlow() {
  const queryClient = useQueryClient();

  const { data: todayAttendance, isLoading: isLoadingToday } = useTodayAttendance();
  const { data: locations = [], isLoading: isLoadingLocations } = useLocations();

  const [step, setStep] = useState(0);
  const [location, setLocation] = useState<Locations | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Tự động tìm địa điểm đã check-in từ todayAttendance
  useEffect(() => {
    if (todayAttendance?.location_name && locations.length > 0) {
      const found = locations.find(
        (loc) => loc.location_name === todayAttendance.location_name
      );
      if (found) {
        setLocation(found);
      } else if (locations.length > 0) {
        setLocation(locations[0]);
      }
    }
  }, [todayAttendance, locations]);

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
    if (latitude === null || longitude === null || !faceImage) {
      setSubmitError("Thiếu thông tin vị trí hoặc ảnh khuôn mặt.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append(
        "image",
        dataUrlToBlob(faceImage),
        "checkout.jpg",
      );

      await checkOutApi(formData);

      // Refetch queries
      await queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      await queryClient.invalidateQueries({ queryKey: ["attendance-history"] });

      setIsSuccess(true);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      let message = "Chấm công ra thất bại. Vui lòng thử lại.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        message = detail[0]?.msg || "Dữ liệu gửi lên không hợp lệ.";
      }

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [latitude, longitude, faceImage, queryClient]);

  return {
    step,
    location,
    latitude,
    longitude,
    faceImage,
    isLoadingData: isLoadingToday || isLoadingLocations,
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
