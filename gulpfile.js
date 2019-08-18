const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const del = require("del");

function clean() {
  return del(["src/css/*", "src/js/*"]);
}

function compile_sass() {
  console.log("compile...");
  return gulp
    .src(["src/scss/*.scss", "node_modules/bootstrap/scss/bootstrap.scss"])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
}

function move_js() {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/tether/dist/js/tether.min.js",
      "node_modules/jquery/dist/jquery.min.js"
    ])
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
}

function launch_server() {
  browserSync.init({
    server: "./src/"
  });
  compile_sass();
}

function watch_files() {
  gulp.watch(
    ["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"],
    compile_sass
  );

  gulp.watch("src/*.html").on("change", browserSync.reload);
}

const watch = gulp.parallel(watch_files, launch_server);
const build = gulp.series(clean, gulp.parallel(move_js, watch));

exports.clean = clean;
exports.watch = watch;
exports.build = build;
exports.default = build;
