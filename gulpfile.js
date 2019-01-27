var gulp = require("gulp");
var clean = require('gulp-clean');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", function () {
    return gulp
        .src("./dist", {read: false})
        .pipe(clean());
});

gulp.task("copy", function () {
    return gulp
        .src("./src/config/config.json")
        .pipe(gulp.dest("./dist/config"));
});

gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"));
});

gulp.task("build", ["copy", "ts"]);
