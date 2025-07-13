require("@babel/register")({
  configFile: require("path").resolve(__dirname, "babel.mocha.js"),
  extensions: [".js", ".ts", ".tsx"],
});
