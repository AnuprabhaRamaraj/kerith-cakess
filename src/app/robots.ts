import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://kerithcakes.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/menu",
          "/custom-cake",
          "/gallery",
          "/cart",
          "/contact",
          "/images/",
          "/*.css",
          "/*.js",
          "/*.jpg",
          "/*.png",
          "/*.webp",
          "/*.svg",
          "/*.ico",
        ],
        disallow: [
          "/user/",
          "/user/dashboard",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
