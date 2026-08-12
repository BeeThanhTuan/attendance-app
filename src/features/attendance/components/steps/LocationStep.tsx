import { useEffect, useRef } from "react";
import { LocateFixed, Loader2 } from "lucide-react";

import type { Locations } from "../../types/location.types";

import WorkplaceSelector from "../location/WorkplaceSelector";
import LocationStatusCard from "../location/LocationStatusCard";
import AttendanceMap from "../map/AttendanceMap";

import { useLocationVerification } from "../../hooks/useLocationVerification";

interface Props {
  locations: Locations[];
  selectedLocation: Locations | null;
  onSelect(location: Locations): void;
  onNext(location: Locations, latitude: number, longitude: number): void;
  disableSelector?: boolean;
}

export default function LocationStep({
  locations,
  selectedLocation,
  onSelect,
  onNext,
  disableSelector = false,
}: Props) {
  const {
    latitude,
    longitude,
    accuracy,
    distanceToTarget,
    isWithinRadius,
    isLoading,
    error,
    refreshLocation,
  } = useLocationVerification(selectedLocation);

  /**
   * Tránh chuyển step nhiều lần
   * khi GPS liên tục cập nhật.
   */
  const hasMovedNextRef = useRef(false);

  /**
   * Khi user đổi địa điểm:
   * cho phép verify lại từ đầu.
   */
  useEffect(() => {
    hasMovedNextRef.current = false;
  }, [selectedLocation?.id]);

  /**
   * Tự động chuyển:
   *
   * Location
   *    ↓
   * GPS hợp lệ
   *    ↓
   * Trong radius
   *    ↓
   * Face / Confirm
   */
  useEffect(() => {
    if (
      hasMovedNextRef.current ||
      !selectedLocation ||
      isLoading ||
      error ||
      latitude === null ||
      longitude === null ||
      !isWithinRadius
    ) {
      return;
    }

    hasMovedNextRef.current = true;

    const timer = setTimeout(() => {
      onNext(selectedLocation, latitude, longitude);
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    selectedLocation,
    latitude,
    longitude,
    isWithinRadius,
    isLoading,
    error,
    onNext,
  ]);

  /**
   * Vị trí hiện tại của user
   */
  const currentPosition =
    latitude !== null && longitude !== null
      ? {
        latitude,
        longitude,
      }
      : null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* =========================
          WORKPLACE SELECTOR
      ========================= */}

      <WorkplaceSelector
        locations={locations}
        selected={selectedLocation}
        onSelect={onSelect}
        disabled={disableSelector}
      />

      {/* =========================
          MAP
      ========================= */}

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl" style={{ minHeight: "200px" }}>
        {selectedLocation ? (
          <AttendanceMap
            isWithinRadius={isWithinRadius}
            workplace={selectedLocation}
            currentPosition={currentPosition}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 rounded-2xl">
            <p className="text-sm text-slate-400">
              Vui lòng chọn địa điểm làm việc
            </p>
          </div>
        )}

        {/* GPS LOADING */}
        {isLoading && !currentPosition && (
          <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 ">
            Đang xác định vị trí...
          </div>
        )}

        {/* GPS ERROR */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600 ">
            {error}
          </div>
        )}

        {/* REFRESH BUTTON */}
        <button
          type="button"
          onClick={() => {
            hasMovedNextRef.current = false;
            refreshLocation();
          }}
          disabled={isLoading}
          className="absolute right-3 bottom-3 z-[1000] flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700  backdrop-blur-sm transition active:scale-95 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 size={13} className="animate-spin text-primary" />
          ) : (
            <LocateFixed size={13} className="text-primary" />
          )}
          {isLoading ? "Đang lấy..." : "Cập nhật vị trí"}
        </button>
      </div>

      {/* =========================
          LOCATION STATUS
      ========================= */}

      <LocationStatusCard
        accuracy={accuracy}
        distance={distanceToTarget}
        radius={selectedLocation?.radius_meters ?? null}
        latitude={latitude}
        longitude={longitude}
        isWithinRadius={isWithinRadius}
      />
    </div>
  );
}
