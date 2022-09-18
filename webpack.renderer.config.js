const rules = require("./webpack.rules");

rules.push({
  test : /\.css$/,
  use : [ {loader : "style-loader"}, {loader : "css-loader"} ],
});

module.exports = {
  // Put your normal webpack config below here
  devtool : "source-map",
  module : {
    rules,
  },
  resolve : {extensions : [ ".js", ".jsx", ".ts", "tsx" ]},
};
