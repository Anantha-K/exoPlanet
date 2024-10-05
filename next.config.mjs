/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // Add support for GLSL shaders
      config.module.rules.push({
        test: /\.(glsl|vs|fs)$/,
        type: 'asset/source', // Use Webpack 5 asset source loader
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  