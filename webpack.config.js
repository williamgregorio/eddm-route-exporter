const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',

    entry: {
      popup: './src/popup/popup.js',
      content_script: './src/content/content_script.js',
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      clean: true,
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/icons', to: 'icons' },
          { from: 'src/popup/popup.html', to: 'popup/popup.html' },
          { from: 'src/vendor/tailwindcss_cdn_4.1.3.js', to: 'vendor/tailwindcss_cdn_4.1.3.js' }
        ],
      }),
    ],

    resolve: {
      extensions: ['.js'],
    },
  };
};
