/**
 * Trả về URL đầy đủ của hình ảnh (avatar, check-in, etc.)
 * - Nếu path rỗng: trả về chuỗi rỗng
 * - Nếu path đã chứa protocol (http/https/data:): giữ nguyên
 * - Nếu path là relative (/uploads/...): tự động ghép với Backend domain nếu có
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const rawBaseUrl = import.meta.env.VITE_API_URL || "";
  let baseUrl = "";

  if (rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")) {
    try {
      const url = new URL(rawBaseUrl);
      baseUrl = url.origin;
    } catch {
      baseUrl = "";
    }
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
