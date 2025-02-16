import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
  mode: 'production',
  entry: {
    content: path.join(__dirname, 'src', 'content.ts'),
    background: path.join(__dirname, 'src', 'background.ts'),
    main: path.join(__dirname, 'src', 'main.ts'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: `src/asset/manifest.json`,
          to: 'manifest.json',
          transform: (content) =>
            Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                author: process.env.npm_package_author_name,
                homepage_url: process.env.npm_package_homepage,
                ...JSON.parse(content.toString()),
              }),
            ),
        },
        {
          from: path.join(__dirname, 'src', 'asset', 'icon/'),
          to: 'icon/[name][ext]',
        },
      ],
    }),
    new VueLoaderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],
  optimization: {},
};
