var srcDir = "./src/";
var buildDir = "./public_html/";

var jsSrcDir = srcDir + "js/";
var jsBuildDir = buildDir + "js/";

var sassSrcDir = srcDir + "scss/";
var sassBuildDir = buildDir + "css/";

var assetsSrcDir = srcDir + "public_transfer/";
var assetsBuildDir = buildDir;

var templateSrcDir = srcDir + "templates/";
var templateBuildDir = buildDir;


function siteSettings() {
  return {
    siteName: "alexbeuscher.com",
    directories:[buildDir, jsBuildDir],
    jsFiles: [
      {
        name: "Main Bundle",
        srcDir: jsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "bundle.js"
      },
    ],
    templates: [
      {
        name: "Main Template Group",
        srcDir: templateSrcDir,
        buildDir: templateBuildDir
      },
    ],
    stylesheets: [
      {
        name: "Main Stylesheet",
        srcDir: sassSrcDir,
        buildDir: sassBuildDir
      },
    ],
    assets: [
      {
        name: "Main Public Assets",
        srcDir: [assetsSrcDir + "**/*"],
        buildDir: assetsBuildDir
      }
    ]
  };
}
module.exports = siteSettings;
