import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (base locale embarquée) ne doit pas être empaqueté côté serveur :
  // on le garde externe pour éviter d'inclure le WASM dans le bundle.
  serverExternalPackages: ["@electric-sql/pglite", "cloudinary"],
};

export default nextConfig;
