const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        // Only add bundle analyzer in production analysis mode
        ...(process.env.ANALYZE_BUNDLE ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
          })
        ] : []),
        // Add compression plugin for production
        ...(process.env.NODE_ENV === 'production' ? [
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          }),
          new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: { level: 11 },
            threshold: 10240,
            minRatio: 0.8,
          })
        ] : [])
      ]
    },
    configure: (webpackConfig) => {
      // Optimize bundle size
      if (process.env.NODE_ENV === 'production') {
        // Enhanced code splitting
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // React core
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 40,
            },
            // Router and helmet
            router: {
              test: /[\\/]node_modules[\\/](react-router-dom|react-helmet-async)[\\/]/,
              name: 'router',
              chunks: 'all',
              priority: 35,
            },
            // 3D libraries
            three: {
              test: /[\\/]node_modules[\\/](@react-three|three)[\\/]/,
              name: 'three',
              chunks: 'async',
              priority: 30,
            },
            // Animation libraries
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer',
              chunks: 'all',
              priority: 25,
            },
            // Icons
            icons: {
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 20,
            },
            // Other vendors
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Common code across async chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            }
          }
        };

        // Enhanced minification
        webpackConfig.optimization.minimize = true;
        webpackConfig.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            extractComments: false,
          }),
        ];

        // Enable tree shaking
        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.sideEffects = false;

        // Runtime chunk
        webpackConfig.optimization.runtimeChunk = 'single';

        // Module concatenation
        webpackConfig.optimization.concatenateModules = true;

        // Performance hints
        webpackConfig.performance = {
          hints: 'warning',
          maxEntrypointSize: 512000,
          maxAssetSize: 512000,
        };
      }

      // Resolve optimizations
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: ['.js', '.jsx', '.json'],
        alias: {
          ...webpackConfig.resolve?.alias,
          // Optimize imports
          'react': 'react',
          'react-dom': 'react-dom',
        },
      };

      return webpackConfig;
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Custom middleware setup
      return middlewares;
    },
    // Enable compression in dev
    compress: true,
    // HTTP/2
    http2: false,
    // Hot reload optimization
    hot: true,
  },
  babel: {
    plugins: [
      // Optimize bundle size
      ...(process.env.NODE_ENV === 'production' ? [
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
        ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]
      ] : [])
    ],
    loaderOptions: (babelLoaderOptions) => {
      // Cache babel compilation
      babelLoaderOptions.cacheDirectory = true;
      babelLoaderOptions.cacheCompression = false;
      return babelLoaderOptions;
    }
  }
};