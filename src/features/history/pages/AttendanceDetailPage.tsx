import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  Image as ImageIcon,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { useParams, useNavigate, data } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import type { AttendanceDetailResponse } from "@/lib/api/history.api";
import { getAttendanceDetail } from "@/lib/api/history.api";
import { formatDateTime, formatDateDisplay } from "@/utils/date";
import { getImageUrl } from "@/lib/utils/image";

import StatusBadge from "@/shared/ui/StatusBadge";
import AppHeader from "@/shared/components/Header";

/* ============================================================
   MAP CENTER UPDATER
============================================================ */
function MapCenterUpdater({ center }: { center: [number, number] }) {
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
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    type: "checkin" | "checkout";
  } | null>(null);
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
            <Loader2 size={32} className="animate-spin text-violet-500" />
            <span className="text-sm font-medium">Đang tải dữ liệu...</span>
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
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <p className="text-base font-bold text-slate-800">
              Không thể tải dữ liệu
            </p>
            <p className="mt-1 text-sm text-slate-400">Vui lòng thử lại sau.</p>
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
  const checkIn = formatDateTime(record.check_in_at);
  const checkOut = formatDateTime(record.check_out_at);
  const confirmed_at = formatDateTime(record?.confirmed_at)
  /* ==========================================================
     IMAGE URL
  ========================================================== */
  const imageCheckInUrl = record.checkin_image_path
    ? getImageUrl(record.checkin_image_path)
    : null;
  const imageCheckOutUrl = record.checkout_image_path
    ? getImageUrl(record.checkout_image_path)
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
        <div className="mx-auto w-full max-w-md px-4 pb-8 pt-4">

          {/* =====================================================
              DATE + STATUS
          ===================================================== */}
          <section className="border-b border-slate-200 pb-5">
            <div className="flex items-start justify-between gap-4">

              {/* Date */}
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Chi tiết chấm công
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  {formatDateDisplay(record.attendance_date)}
                </h1>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  {new Date(
                    `${record.attendance_date}T00:00:00`,
                  ).toLocaleDateString("vi-VN", {
                    weekday: "long",
                  })}
                </p>
              </div>

              {/* Confirmation */}
              <div
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                  record.confirmed
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-amber-200 bg-amber-50 text-amber-600"
                }`}
              >
                {record.confirmed ? (
                  <>
                    <Check size={13} strokeWidth={3} />
                    Đã xác nhận
                  </>
                ) : (
                  <>
                    <X size={13} strokeWidth={2.5} />
                    Chưa xác nhận
                  </>
                )}
              </div>
            </div>

            {/* Attendance status */}
            <div className="mt-4">
              <StatusBadge status={record.status} />
            </div>
          </section>

          {/* =====================================================
              ATTENDANCE
          ===================================================== */}
          <section className="pt-5">

            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-900">
                Chấm công
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Thời gian và ảnh xác thực
              </p>
            </div>

            <div className="space-y-5">

              {/* =================================================
                  CHECK IN
              ================================================= */}
              <div>
                <div className="flex items-start gap-3">

                  {/* Status icon */}
                  <div className="relative flex shrink-0 flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                      <Check
                        size={17}
                        strokeWidth={3}
                        className="text-emerald-600"
                      />
                    </div>

                    {/* Connecting line */}
                    <div className="absolute top-10 h-[calc(100%+1.25rem)] w-px bg-slate-200" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pb-2">

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Chấm công vào
                        </p>

                        <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                          {checkIn.date}
                        </p>
                      </div>

                      <p className="text-lg font-black tracking-tight text-emerald-600">
                        {checkIn.time}
                      </p>
                    </div>

                    {/* Check-in image */}
                    {imageCheckInUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage({
                            url: imageCheckInUrl,
                            type: "checkin",
                          })
                        }
                        className="group mt-3 flex w-full items-center gap-3 border-t border-slate-100 pt-3 text-left"
                      >
                        <img
                          src={imageCheckInUrl}
                          alt="Ảnh chấm công vào"
                          className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-700">
                            Ảnh chấm công vào
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Nhấn để xem ảnh
                          </p>
                        </div>

                        <ImageIcon
                          size={17}
                          className="shrink-0 text-slate-400 transition-colors group-hover:text-violet-500"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  CHECK OUT
              ================================================= */}
              <div>
                <div className="flex items-start gap-3">

                  {/* Status icon */}
                  <div className="flex shrink-0 flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        record.check_out_at
                          ? "bg-blue-50"
                          : "bg-slate-100"
                      }`}
                    >
                      {record.check_out_at ? (
                        <Check
                          size={17}
                          strokeWidth={3}
                          className="text-blue-600"
                        />
                      ) : (
                        <X
                          size={16}
                          strokeWidth={2.5}
                          className="text-slate-400"
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-3">

                      <div>
                        <p
                          className={`text-sm font-bold ${
                            record.check_out_at
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          Chấm công ra
                        </p>

                        <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                          {record.check_out_at
                            ? checkOut.date
                            : "Chưa chấm công ra"}
                        </p>
                      </div>

                      <p
                        className={`text-lg font-black tracking-tight ${
                          record.check_out_at
                            ? "text-blue-600"
                            : "text-slate-300"
                        }`}
                      >
                        {record.check_out_at
                          ? checkOut.time
                          : "--:--"}
                      </p>
                    </div>

                    {/* Check-out image */}
                    {imageCheckOutUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage({
                            url: imageCheckOutUrl,
                            type: "checkout",
                          })
                        }
                        className="group mt-3 flex w-full items-center gap-3 border-t border-slate-100 pt-3 text-left"
                      >
                        <img
                          src={imageCheckOutUrl}
                          alt="Ảnh chấm công ra"
                          className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-700">
                            Ảnh chấm công ra
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Nhấn để xem ảnh
                          </p>
                        </div>

                        <ImageIcon
                          size={17}
                          className="shrink-0 text-slate-400 transition-colors group-hover:text-violet-500"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              LOCATION
          ===================================================== */}
          {record.location && (
            <section className="mt-7 border-t border-slate-200 pt-5">

              <div className="mb-4">
                <h2 className="text-sm font-black text-slate-900">
                  Địa điểm
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Vị trí ghi nhận khi chấm công
                </p>
              </div>

              {/* Location information */}
              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <Building2
                    size={17}
                    className="text-violet-600"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {record.location.location_name}
                  </p>

                  {record.location.address && (
                    <div className="mt-1 flex items-start gap-1.5">
                      <MapPin
                        size={13}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <p className="text-xs leading-5 text-slate-400">
                        {record.location.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="relative mt-4 h-52 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

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

                  <MapCenterUpdater center={mapCenter} />

                  <Marker position={mapCenter} />
                </MapContainer>

                {/* Coordinates */}
                <div className="absolute bottom-2.5 left-2.5 z-[400] rounded-md bg-white/90 px-2 py-1 shadow-sm backdrop-blur">
                  <span className="font-mono text-[9px] font-medium text-slate-500">
                    {mapCenter[0].toFixed(6)},{" "}
                    {mapCenter[1].toFixed(6)}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* =====================================================
              CONFIRMATION INFO
          ===================================================== */}
          {record.confirmed && (
            <section className="mt-6 border-t border-slate-200 pt-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Check
                    size={17}
                    strokeWidth={3}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Xác nhận bởi
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-800">
                    {record.confirmed_by || "Quản lý"}
                  </p>

                  {record.confirmed_at && (
                    <p className="mt-0.5 text-sm text-slate-400">
                      {confirmed_at.date} - {confirmed_at.time}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>

    {/* ============================================================
        IMAGE PREVIEW
    ============================================================ */}
    {selectedImage && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
        onClick={() => setSelectedImage(null)}
      >
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={20} />
        </button>

        <div
          className="relative max-h-[90vh] max-w-[95vw]"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={selectedImage.url}
            alt={
              selectedImage.type === "checkin"
                ? "Ảnh chấm công vào"
                : "Ảnh chấm công ra"
            }
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-medium text-white">
            {selectedImage.type === "checkin"
              ? `Chấm công vào • ${checkIn.time}`
              : `Chấm công ra • ${checkOut.time}`}
          </div>
        </div>
      </div>
    )}
  </>
);
}
