import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  MapPin,
  Search,
  X,
} from "lucide-react";

import type { Locations } from "../../types/location.types";

interface Props {
  locations: Locations[];
  selected: Locations | null;
  onSelect(location: Locations): void;
  disabled?: boolean;
}

export default function WorkplaceSelector({
  locations,
  selected,
  onSelect,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus ô search khi mở
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open]);

  const filteredLocations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return locations;
    }

    return locations.filter((location) => {
      return (
        location.location_name
          .toLowerCase()
          .includes(keyword) ||
        location.address
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [locations, search]);

  function handleSelect(location: Locations) {
    onSelect(location);
    setOpen(false);
    setSearch("");
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation();

    setSearch("");
  }

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
    >

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={[
          "relative flex h-12 w-full items-center",
          "rounded-2xl bg-white",
          "pl-12 pr-12 text-left",
          "outline-none transition-all border-slate",

          disabled
            ? "cursor-not-allowed bg-slate-50 opacity-75"
            : "",

        ].join(" ")}
      >
        {/* Map icon */}
        <MapPin
          size={18}
          className="absolute left-4 text-slate-700"
        />

        {/* Selected */}
        {selected ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-700">
              {selected.location_name}
            </p>
          </div>
        ) : (
          <span className="text-sm font-medium text-slate-800">
            Chọn địa điểm
          </span>
        )}

        {/* Right icon */}
        {!disabled && (
          <ChevronDown
            size={18}
            className={[
              "absolute right-4 text-slate-500 transition-transform",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 overflow-hidden rounded-2xl border-slate bg-white shadow-lg">
          {/* Search */}
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Tìm địa điểm..."
                className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-primary/20"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Result */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
                  <MapPin
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Không tìm thấy địa điểm
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            ) : (
              filteredLocations.map((location) => {
                const isSelected =
                  selected?.id === location.id;

                return (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() =>
                      handleSelect(location)
                    }
                    className={[
                      "flex w-full items-center gap-3",
                      "rounded-xl px-3 py-2",
                      "text-left transition",
                      isSelected
                        ? "bg-white/5"
                        : "hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {/* Icon */}
                    <div
                      className={[
                        "flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100",
                      ].join(" ")}
                    >
                      <MapPin size={17} />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "text-sm",
                          isSelected
                            ? "font-bold text-primary"
                            : "font-semibold text-slate-800",
                        ].join(" ")}
                      >
                        {location.location_name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {location.address}
                      </p>
                    </div>


                    {/* Check */}
                    {isSelected && (
                      <Check
                        size={18}
                        className="shrink-0 text-primary"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {filteredLocations.length > 0 && (
            <div className="border-t border-slate-100 px-3 py-2">
              <p className="text-center text-[11px] text-slate-600">
                {filteredLocations.length} địa điểm
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}