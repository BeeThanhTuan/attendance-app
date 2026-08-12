import { useEffect, useMemo, useRef } from "react";
import { divIcon } from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { Locations } from "../../types/location.types";

interface MapControllerProps {
  workplacePosition: [number, number];
  userPosition: [number, number] | null;
  focusUserKey: number;
}

function MapController({
  workplacePosition,
  userPosition,
  focusUserKey,
}: MapControllerProps) {
  const map = useMap();

  const previousWorkplaceRef = useRef<[number, number] | null>(null);
  const focusedUserKeyRef = useRef<number | null>(null);

  // =====================================================
  // MAP SIZE
  // =====================================================

  useEffect(() => {
    const refreshMapSize = () => {
      map.invalidateSize({
        animate: false,
        pan: false,
      });
    };

    const frame1 = requestAnimationFrame(() => {
      refreshMapSize();

      requestAnimationFrame(() => {
        refreshMapSize();
      });
    });

    const timer = window.setTimeout(() => {
      refreshMapSize();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(refreshMapSize);
    });

    resizeObserver.observe(map.getContainer());

    return () => {
      cancelAnimationFrame(frame1);
      window.clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map]);

  // =====================================================
  // WORKPLACE
  //
  // Chỉ flyTo khi workplace thực sự thay đổi.
  // =====================================================

  useEffect(() => {
    const previous = previousWorkplaceRef.current;

    const workplaceChanged =
      previous === null ||
      previous[0] !== workplacePosition[0] ||
      previous[1] !== workplacePosition[1];

    if (!workplaceChanged) {
      return;
    }

    previousWorkplaceRef.current = workplacePosition;

    // Hủy animation hiện tại nếu có
    map.stop();

    // Reset trạng thái focus user
    focusedUserKeyRef.current = null;

    map.flyTo(workplacePosition, 17, {
      animate: true,
      duration: 0.8,
    });
  }, [
    map,
    workplacePosition[0],
    workplacePosition[1],
  ]);

  // =====================================================
  // USER LOCATION
  //
  // Chỉ flyTo khi focusUserKey thay đổi.
  //
  // GPS cập nhật bình thường:
  // -> marker thay đổi
  // -> map KHÔNG di chuyển.
  // =====================================================

  useEffect(() => {
    if (!userPosition) {
      return;
    }

    if (focusedUserKeyRef.current === focusUserKey) {
      return;
    }

    focusedUserKeyRef.current = focusUserKey;

    map.stop();

    map.flyTo(userPosition, 17, {
      animate: true,
      duration: 0.8,
    });
  }, [
    map,
    userPosition,
    focusUserKey,
  ]);

  return null;
}

// =====================================================
// USER LOCATION ICON
// =====================================================

const userLocationIcon = divIcon({
  className: "user-location-marker",

  html: `
    <div class="relative flex h-8 w-8 items-center justify-center">
      <div
        class="
          absolute
          h-8
          w-8
          rounded-full
          bg-blue-500/20
          animate-location-pulse
        "
      ></div>

      <div
        class="
          relative
          h-3.5
          w-3.5
          rounded-full
          border-2
          border-white
          bg-blue-500
          shadow-md
        "
      ></div>
    </div>
  `,

  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// =====================================================
// TYPES
// =====================================================

interface Props {
  workplace: Locations | null;

  isWithinRadius: boolean;

  currentPosition: {
    latitude: number;
    longitude: number;
  } | null;

  focusUserKey: number;
}

// =====================================================
// COMPONENT
// =====================================================

export default function AttendanceMap({
  workplace,
  currentPosition,
  isWithinRadius,
  focusUserKey,
}: Props) {
  // =====================================================
  // NO WORKPLACE
  // =====================================================

  if (!workplace) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
        Vui lòng chọn địa điểm làm việc
      </div>
    );
  }

  // =====================================================
  // POSITIONS
  // =====================================================

  const workplacePosition: [number, number] = [
    workplace.latitude,
    workplace.longitude,
  ];

  const userPosition: [number, number] | null =
    currentPosition
      ? [
          currentPosition.latitude,
          currentPosition.longitude,
        ]
      : null;

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const statusColor = isWithinRadius
    ? "#16a34a"
    : "#ef4444";

  // =====================================================
  // CIRCLE
  // =====================================================

  const radiusOptions = useMemo(
    () => ({
      color: statusColor,
      fillColor: statusColor,
      fillOpacity: 0.12,
      weight: 1,
    }),
    [statusColor],
  );

  // =====================================================
  // LINE
  // =====================================================

  const lineOptions = useMemo(
    () => ({
      color: statusColor,
      weight: 2,
      opacity: 0.55,
      dashArray: "6 6",
    }),
    [statusColor],
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={workplacePosition}
        zoom={17}
        minZoom={12}
        maxZoom={20}
        className="h-full w-full"
        zoomControl={false}
        attributionControl
      >
        <MapController
          workplacePosition={workplacePosition}
          userPosition={userPosition}
          focusUserKey={focusUserKey}
        />

        {/* =================================================
            TILE
        ================================================= */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
          maxNativeZoom={20}
          keepBuffer={2}
          updateWhenIdle={false}
          updateWhenZooming
          crossOrigin
        />

        {/* =================================================
            WORKPLACE
        ================================================= */}

        <Marker position={workplacePosition} />

        {/* =================================================
            CHECK-IN RADIUS
        ================================================= */}

        <Circle
          center={workplacePosition}
          radius={workplace.radius_meters}
          pathOptions={radiusOptions}
        />

        {/* =================================================
            USER LOCATION
        ================================================= */}

        {userPosition && (
          <>
            <Marker
              position={userPosition}
              icon={userLocationIcon}
            />

            <Polyline
              positions={[
                workplacePosition,
                userPosition,
              ]}
              pathOptions={lineOptions}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}