const fallbackSiteUrl = "https://akramul-security-portfolio.vercel.app";

function normaliseSiteUrl(value?: string) {
  if (!value) return fallbackSiteUrl;

  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.origin;
    }
  } catch {
    // Fall back to the known production URL for an invalid deployment setting.
  }

  return fallbackSiteUrl;
}

export const siteUrl = normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const siteUrlWithTrailingSlash = `${siteUrl}/`;
