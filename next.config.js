const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: "file-loader",
      options: {
        name: "static/media/[name].[hash:8].[ext]",
        esModule: false,
      },
    });

    return config;
  },
};

module.exports = nextConfig;
