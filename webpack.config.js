const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "src/index.js"),
    form: path.join(__dirname, "src/form/form.js"),
    topbar: path.join(__dirname, "src/assets/javascripts/topbar.js"),

  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  module: {    rules: [      {        test: /\.js/,        exclude: /(node_modules)/,        use: ["babel-loader"]      },      {        test: /\.scss$/i,        use: ["style-loader", "css-loader", "sass-loader"]      }    ]  },
  plugins: [    
   
    new CopyWebpackPlugin({
      patterns:[
        {
          from:"./src/assets/images/*", /*  etoile, pour toutes les images */
          to:"assets/images",
        },
      ],
    }),
    new HtmlWebpackPlugin({    
        filename:"index.html",
        template: path.join(__dirname, "./src/index.html"),
         chunks:["main", "topbar"]
         }),
         new HtmlWebpackPlugin({    
          filename:"form.html",
          template: path.join(__dirname, "./src/form/form.html"),
           chunks:["form", "topbar"]
           }),
          
        ],  stats: "minimal",  devtool: "source-map",  mode: "development",  devServer: {    open: false,    static: path.resolve(__dirname, './dist'),    watchFiles: ['./src/**'],    port: 4000,    hot: true,  }};