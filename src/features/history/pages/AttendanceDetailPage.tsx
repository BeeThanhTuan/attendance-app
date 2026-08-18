import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Check,
  Image as ImageIcon,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import type {
  AttendanceDetailResponse,
} from "@/lib/api/history.api";
import {
  getAttendanceDetail,
} from "@/lib/api/history.api";
import { formatDateTime, formatDateDisplay } from "@/utils/date";
import { getImageUrl } from "@/lib/utils/image";

import StatusBadge from "@/shared/ui/StatusBadge";
import AppHeader from "@/shared/components/Header";

/* ============================================================
   MAP CENTER UPDATER
============================================================ */
function MapCenterUpdater({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 0.6,
    });
  }, [center, map]);

  return null;
}

/* ============================================================
   PAGE
============================================================ */

export default function AttendanceDetailPage() {
  const { date } = useParams<{
    date: string;
  }>();

  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(false);
  const {
    data: record,
    isLoading,
    isError,
  } = useQuery<AttendanceDetailResponse>({
    queryKey: ["attendance-detail", date],
    queryFn: () => getAttendanceDetail(date!),
    enabled: Boolean(date),
  });


  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
        {/* Header */}
        <AppHeader title="Chi tiết chấm công" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2
              size={32}
              className="animate-spin text-violet-500"
            />
            <span className="text-sm font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (isError || !record) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
        {/* Header */}

        <AppHeader title="Chi tiết chấm công" />
        {/* Error */}

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
              <AlertTriangle
                size={28}
                className="text-rose-500"
              />
            </div>
            <p className="text-base font-bold text-slate-800">
              Không thể tải dữ liệu
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Vui lòng thử lại sau.
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white  transition active:scale-95"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     DATA
  ========================================================== */
  const checkIn = formatDateTime(
    record.check_in_at,
  );
  const checkOut = formatDateTime(
    record.check_out_at,
  );


  /* ==========================================================
     IMAGE URL
  ========================================================== */
  const imageUrl = record.checkin_image_path
    ? getImageUrl(record.checkin_image_path)
    : null;
  /* ==========================================================
     MAP
  ========================================================== */
  const mapCenter: [number, number] = [
    Number(record.location?.latitude ?? 13.7563),
    Number(record.location?.longitude ?? 109.2297),
  ];

  /* ==========================================================
  =============================================
     RENDER
  ========================================================== */

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
        <AppHeader title="Chi tiết chấm công" />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-md bg-white px-5 pb-10 pt-5">
            <section>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <CalendarDays
                      size={13}
                      className="text-violet-500"
                    />
                    Ngày chấm công
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    {formatDateDisplay(
                      record.attendance_date,
                    )}
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-slate-400">
                    {new Date(
                      `${record.attendance_date}T00:00:00`,
                    ).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                      },
                    )}
                  </p>
                </div>
                {/* Status */}
                <div className="shrink-0">
                  <StatusBadge
                    status={record.status}
                  />
                </div>
              </div>
            </section>
            <div className="my-6 h-px bg-slate-100" />
            <section>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-4 bottom-5 w-px bg-slate-200" />
                <div className="relative flex gap-4">
                  {/* Node */}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white  ring-4 ring-emerald-50">
                    <Check
                      size={17}
                      strokeWidth={3}
                    />
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1 pb-8">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-emerald-600">
                          Chấm công vào
                        </p>
                        <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                          {checkIn.time}
                          <span className="mx-2 text-slate-300">•</span>
                          {checkIn.date}
                        </p>
                      </div>
                    </div>
                    {/* Location */}
                    {record.location && (
                      <div className="mt-3 flex items-start gap-2">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-violet-500"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-5 text-slate-600">
                            {record.location.location_name}
                          </p>
                          {record.location.address && (
                            <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                              {record.location.address}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Image action */}
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowImage(true)
                        }
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 transition active:opacity-60"
                      >
                        <ImageIcon size={14} />
                        Xem ảnh chấm công
                      </button>
                    )}

                  </div>
                </div>
                {/* =================================================
                    CHECK OUT
                ================================================ */}
                <div className="relative flex gap-4">
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full  ring-4 ${record.check_out_at
                      ? "bg-blue-500 text-white ring-blue-50"
                      : "bg-slate-200 text-white ring-slate-50"
                      }`}
                  >
                    {record.check_out_at ? (
                      <Check
                        size={16}
                        strokeWidth={3}
                      />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold ${record.check_out_at
                        ? "text-blue-600"
                        : "text-slate-500"
                        }`}
                    >
                      Chấm công ra
                    </p>
                    <p
                      className={`mt-1 text-xl font-bold tracking-tight ${record.check_out_at
                        ? "text-slate-900"
                        : "text-slate-300"
                        }`}
                    >
                      {record.check_out_at ? (
                        <>
                          {checkOut.time}
                          <span className="mx-2 text-slate-300">•</span>
                          {checkOut.date}
                        </>
                      ) : (
                        "Chưa chấm công ra"
                      )}
                    </p>
                    {/* Checkout location */}
                    {record.location &&
                      record.check_out_at && (
                        <div className="mt-3 flex items-start gap-2">
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-violet-500"
                          />
                          <p className="text-xs font-semibold leading-5 text-slate-500">
                            {record.location.location_name}
                          </p>

                        </div>
                      )}
                  </div>
                </div>
              </div>
            </section>
            {/* ==================================================
                LOCATION
            ================================================== */}
            {record.location && (
              <>
                <div className="my-6 h-px bg-slate-100" />
                <section>
                  {/* Section title */}
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                      <MapPin
                        size={18}
                        className="text-violet-600"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Địa điểm
                      </h3>
                      <p className="mt-0.5 text-xs font-medium text-slate-400">
                        Vị trí được ghi nhận khi chấm công
                      </p>
                    </div>
                  </div>
                  {/* Location information */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <Building2
                          size={17}
                          className="text-slate-500"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-5 text-slate-800">
                          {record.location.location_name}
                        </p>
                        {record.location.address && (
                          <div className="mt-1 flex items-start gap-1.5">
                            <MapPin
                              size={12}
                              className="mt-0.5 shrink-0 text-violet-500"
                            />
                            <p className="text-xs leading-5 text-slate-400">
                              {record.location.address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Map */}
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    <MapContainer
                      center={mapCenter}
                      zoom={15}
                      scrollWheelZoom={true}
                      zoomControl={false}
                      dragging={true}
                      doubleClickZoom={false}
                      touchZoom={false}
                      keyboard={false}
                      attributionControl={false}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    >
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
                      <MapCenterUpdater
                        center={mapCenter}
                      />
                      <Marker
                        position={mapCenter}
                      />
                    </MapContainer>
                    {/* Coordinates */}
                    <div className="absolute bottom-3 left-3 z-[400] rounded-full bg-white/95 px-3 py-1.5  ring-1 ring-slate-200 backdrop-blur">
                      <p className="font-mono text-[10px] font-semibold text-slate-500">
                        {mapCenter[0].toFixed(6)},{" "}
                        {mapCenter[1].toFixed(6)}
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}

          </div>
        </main>
      </div>
      {/* ========================================================
          IMAGE MODAL
      ======================================================== */}
      {showImage && imageUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setShowImage(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setShowImage(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            aria-label="Đóng"
          >
            <X size={23} />
          </button>
          {/* Image */}
          <div
            className="relative flex max-h-[85vh] max-w-[92vw] items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={imageUrl}
              alt="Ảnh chấm công"
              className="max-h-[78vh] max-w-full rounded-2xl object-contain"
            />
            {/* Caption */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              Ảnh chấm công •{" "}
              {checkIn.time}
            </div>
          </div>
        </div>
      )}
    </>
  );
}