/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cloud.appwrite.io'],
  },
  webpack: (config, { isServer }) => {
    // Add support for loading MP3 files
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/sounds/',
            outputPath: `${isServer ? '../' : ''}static/sounds/`,
            name: '[name].[ext]',
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
