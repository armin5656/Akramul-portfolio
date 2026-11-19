import type { MetadataRoute } from "next";
import { siteUrlWithTrailingSlash } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrlWithTrailingSlash, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
