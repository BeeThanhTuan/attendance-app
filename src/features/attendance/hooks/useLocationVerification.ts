import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Locations } from "../types/location.types";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

const MAX_ACCURACY = 30; // mét

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;

  const Δφ =
    ((lat2 - lat1) * Math.PI) / 180;

  const Δλ =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return R * c;
}

export function useLocationVerification(
  targetWorkplace: Locations | null = null,
) {
  const [location, setLocation] =
    useState<LocationState>({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: null,
      isLoading: false,
    });

  const watchIdRef = useRef<number | null>(null);

  // Lưu vị trí tốt nhất đã nhận được
  const bestAccuracyRef = useRef<number | null>(
    null,
  );

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current,
      );

      watchIdRef.current = null;
    }
  }, []);

  const getCurrentLocation =
    useCallback(() => {
      if (!navigator.geolocation) {
        setLocation((prev) => ({
          ...prev,
          isLoading: false,
          error:
            "Trình duyệt không hỗ trợ Geolocation.",
        }));

        return;
      }

      // Reset mẫu tốt nhất
      bestAccuracyRef.current = null;

      setLocation((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // Nếu đang watch thì dừng trước
      stopWatching();

      watchIdRef.current =
        navigator.geolocation.watchPosition(
          (position) => {
            const {
              latitude,
              longitude,
              accuracy,
            } = position.coords;

            console.log("GPS:", {
              latitude,
              longitude,
              accuracy,
            });

            const currentBest =
              bestAccuracyRef.current;

            // Chỉ nhận nếu đây là accuracy tốt hơn
            if (
              currentBest === null ||
              accuracy < currentBest
            ) {
              bestAccuracyRef.current =
                accuracy;

              setLocation({
                latitude,
                longitude,
                accuracy,
                error: null,
                isLoading: false
              });
            }

            // Đủ chính xác → dừng lấy GPS
            if (accuracy <= MAX_ACCURACY) {
              setLocation({
                latitude,
                longitude,
                accuracy,
                error: null,
                isLoading: false,
              });

              stopWatching();
            }
          },

          (error) => {
            let message =
              "Không thể lấy vị trí của bạn.";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                message =
                  "Bạn đã từ chối quyền truy cập vị trí.";
                break;

              case error.POSITION_UNAVAILABLE:
                message =
                  "Không thể xác định vị trí hiện tại.";
                break;

              case error.TIMEOUT:
                message =
                  "Lấy vị trí quá thời gian.";
                break;
            }

            setLocation((prev) => ({
              ...prev,
              isLoading: false,
              error: message,
            }));
          },

          {
            enableHighAccuracy: true,

            // Cho GPS thời gian tìm vị trí
            timeout: 30000,

            // Không sử dụng vị trí cache
            maximumAge: 0,
          },
        );
    }, [stopWatching]);

  useEffect(() => {
    getCurrentLocation();

    return () => {
      stopWatching();
    };
  }, [getCurrentLocation, stopWatching]);

  let distanceToTarget: number | null =
    null;

  let isWithinRadius = false;

  if (
    location.latitude !== null &&
    location.longitude !== null &&
    targetWorkplace
  ) {
    distanceToTarget =
      calculateDistance(
        location.latitude,
        location.longitude,
        targetWorkplace.latitude,
        targetWorkplace.longitude,
      );

    isWithinRadius =
      distanceToTarget <=
      targetWorkplace.radius_meters;
  }

  const isLocationAccurate =
    location.accuracy !== null &&
    location.accuracy <= MAX_ACCURACY;
  const isAccurate =
    location.accuracy !== null &&
    location.accuracy <= MAX_ACCURACY;
  return {
    latitude: location.latitude,
    longitude: location.longitude,

    accuracy: location.accuracy,

    error: location.error,

    isLoading: location.isLoading,

    distanceToTarget,

    isWithinRadius,
    isAccurate,

    isLocationAccurate,

    refreshLocation: getCurrentLocation,
  };
}