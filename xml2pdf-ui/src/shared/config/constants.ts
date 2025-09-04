export const ROUTES = {
  HOME: "/",
  DESIGNER: "/designer",
  PREVIEW: "/preview",
} as const;

export const PAGE_SIZES = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 216, heightMm: 279 },
} as const;

export const FEATURE_FLAGS = {
  CLIENT_PDF: true,
} as const;
