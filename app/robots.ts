// import type { MetadataRoute } from "next";
// import { SITE_URL } from "@/lib/site";

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       {
//         userAgent: "*",
//         allow: "/",
//       },
//       {
//         userAgent: ["GPTBot", "Google-Extended", "ClaudeBot", "CCBot"],
//         allow: "/",
//       },
//     ],
//     sitemap: `${SITE_URL}/sitemap.xml`,
//     host: "blogs.codeprompt.in",
//   };
// }

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/'
            ],
        },
        sitemap: 'https://blogs.codeprompt.in/sitemap.xml',
    }
}
