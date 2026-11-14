import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {};

export default nextConfig;

// Permite usar las variables de Cloudflare también en `npm run dev`
initOpenNextCloudflareForDev();
