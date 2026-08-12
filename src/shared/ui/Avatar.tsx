interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

export default function Avatar({
  src,
  alt = "Avatar",
  size = 48,
}: AvatarProps) {
  return (
    <div
      className="overflow-hidden rounded-full bg-slate-200 ring-2 ring-white shadow"
      style={{
        width: size,
        height: size,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
          NA
        </div>
      )}
    </div>
  );
}