/* Gulp should compile sass and make client side JS compatible - feel free to add your own tasks! */
var gulp = require('gulp');

var sass = require('gulp-sass');


gulp.task('sass', function () {
    return gulp.src('scss/styles.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('css'))
});

gulp.task('watch', function(){
    gulp.watch('scss/styles.scss', gulp.series('sass'));
    // Other watchers
});