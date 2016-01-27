var gulp = require('gulp'),
    livereload = require('gulp-livereload');




gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['js/*.js', 'index.html', 'views/*.html', 'css/style.css'])
        .on('change', function(file) {
            livereload.changed(file.path);
        });
});