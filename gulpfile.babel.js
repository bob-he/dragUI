import gulp from 'gulp'
import babel from 'gulp-babel'

gulp.task('css', () => {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('lib'))
})

gulp.task('fonts', () => {
  return gulp.src('src/fonts/*.*').pipe(gulp.dest('lib/fonts'))
})

gulp.task('default', ['css', 'fonts'], () => {
  return gulp.src('src/**/*.jsx')
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(gulp.dest('lib'))
})
