import { useEffect, useMemo } from "react";
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
  position: [number, number];
}

/**
 * --------------------------------------------------------
 * MAP CONTROLLER
 * --------------------------------------------------------
 *
 * Xử lý:
 * - Map container thay đổi kích thước
 * - Map render bên trong animation
 * - Map mount chưa có kích thước hoàn chỉnh
 * - Fly tới workplace sau khi map đã ready
 */
function MapController({ position }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    let frame1: number;
    let frame2: number;
    let timer: ReturnType<typeof setTimeout>;

    const refreshMap = () => {
      map.invalidateSize({
        animate: false,
        pan: false,
      });
    };

    /**
     * Đợi browser render xong layout
     */
    frame1 = requestAnimationFrame(() => {
      refreshMap();

      frame2 = requestAnimationFrame(() => {
        refreshMap();

        /**
         * Sau khi layout ổn định thêm một chút
         */
        timer = setTimeout(() => {
          refreshMap();

          map.flyTo(position, 17, {
            animate: true,
            duration: 0.8,
          });
        }, 150);
      });
    });

    /**
     * Theo dõi kích thước container
     */
    const container = map.getContainer();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        refreshMap();
      });
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map, position]);

  return null;
}

/**
 * --------------------------------------------------------
 * USER LOCATION ICON
 * --------------------------------------------------------
 */
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

/**
 * --------------------------------------------------------
 * TYPES
 * --------------------------------------------------------
 */
interface Props {
  workplace: Locations | null;

  isWithinRadius: boolean;

  currentPosition: {
    latitude: number;
    longitude: number;
  } | null;
}

/**
 * --------------------------------------------------------
 * COMPONENT
 * --------------------------------------------------------
 */
export default function AttendanceMap({
  workplace,
  currentPosition,
  isWithinRadius,
}: Props) {
  /**
   * ------------------------------------------------------
   * NO WORKPLACE
   * ------------------------------------------------------
   */
  if (!workplace) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
        Vui lòng chọn địa điểm làm việc
      </div>
    );
  }

  const workplacePosition: [number, number] = [
    workplace.latitude,
    workplace.longitude,
  ];

  const userPosition: [number, number] | null = currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : null;
  const statusColor = isWithinRadius ? "#16a34a" : "#ef4444";

  const radiusOptions = useMemo(
    () => ({
      color: statusColor,
      fillColor: statusColor,
      fillOpacity: 0.12,
      weight: 1,
    }),
    [statusColor],
  );

  /**
   * ------------------------------------------------------
   * LINE OPTIONS
   * ------------------------------------------------------
   */

  const lineOptions = useMemo(
    () => ({
      color: statusColor,
      weight: 2,
      opacity: 0.55,
      dashArray: "6 6",
    }),
    [statusColor],
  );

  /**
   * ------------------------------------------------------
   * RENDER
   * ------------------------------------------------------
   */

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={workplacePosition}
        zoom={17}
        minZoom={12}
        maxZoom={19}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <MapController position={workplacePosition} />

        {/* ==================================================
            TILE LAYER
        ================================================== */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c"]}
          maxZoom={19}
          maxNativeZoom={19}
          keepBuffer={2}
          updateWhenIdle={false}
          updateWhenZooming={true}
          crossOrigin={true}
        />

        {/* ==================================================
            WORKPLACE
        ================================================== */}

        <Marker position={workplacePosition} />

        {/* ==================================================
            CHECK-IN RADIUS
        ================================================== */}

        <Circle
          center={workplacePosition}
          radius={workplace.radius_meters}
          pathOptions={radiusOptions}
        />

        {/* ==================================================
            USER LOCATION
        ================================================== */}

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