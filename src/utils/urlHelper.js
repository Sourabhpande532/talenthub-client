/**
 * Resolves an image URL (Applicant photo or Recruiter companyLogo) into a directly
 * renderable src string. Supports standard http/https URLs, data:image/* URIs,
 * blob: URLs, protocol-less domain URLs, Google Drive share links, and GitHub blob links.
 */
export const resolveImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // Preserve data:image/* and blob: URIs as-is
  if (/^data:image\//i.test(trimmed) || /^blob:/i.test(trimmed)) {
    return trimmed;
  }

  //Preserve relative root paths
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Ensure http:// or https:// protocol for domain-style URLs (only when a dot is present)
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(normalized)) {
      normalized = `https://${normalized}`;
    } else {
      return "";
    }
  }

  // Convert Google Drive share/view links into direct embeddable image URLs
  // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing -> https://lh3.googleusercontent.com/d/FILE_ID
  const driveFileMatch = normalized.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  );
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  const driveOpenMatch = normalized.match(
    /drive\.google\.com\/(?:open|uc|thumbnail)\?[^#]*id=([a-zA-Z0-9_-]+)/i,
  );
  if (driveOpenMatch && driveOpenMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveOpenMatch[1]}`;
  }

  // Convert GitHub blob image links to raw content URLs
  if (
    /github\.com\/[^/]+\/[^/]+\/blob\//i.test(normalized) &&
    !normalized.includes("?raw=true")
  ) {
    return normalized
      .replace("github.com/", "raw.githubusercontent.com/")
      .replace("/blob/", "/");
  }

  return normalized;
};

/**
 * Validates optional URL fields (photo, companyLogo, resume, website).
 * Accepts empty string, http(s) URLs, domain-only URLs, and data:image/* URIs (for images).
 */
export const isValidOptionalUrl = (val, { allowDataImage = false } = {}) => {
  if (!val || !val.trim()) return true;
  const trimmed = val.trim();

  if (allowDataImage && /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(trimmed)) {
    return true;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return Boolean(parsed.hostname && parsed.hostname.includes("."));
  } catch {
    return false;
  }
};

/**
 * Normalizes optional URL fields prior to saving to the backend.
 */
export const normalizeOptionalUrl = (val, { isImage = false } = {}) => {
  if (!val || !val.trim()) return "";
  const trimmed = val.trim();

  if (isImage) {
    return resolveImageUrl(trimmed);
  }

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};
