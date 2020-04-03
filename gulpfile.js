var less = require('gulp-less')
    , path = require('path')
    , gulp = require('gulp')
    , replace = require('gulp-replace')
    , runSequence = require('run-sequence')
    , fs = require('fs');
 
gulp.task('less', function () {
    return gulp.src('./*.less')
    .pipe(less())
    .pipe(gulp.dest('./'));
});

gulp.task('replace', function() {
    var now = (new Date()).toISOString();

    return gulp.src(['*.html'])
    .pipe(replace(/\?v\=.*\"/g, "?v=" + now + "\"")) // replace ?v=whatever" with ?v={now}"
    .pipe(gulp.dest('./'));
});

gulp.task('partialize', function() {
    var layout = fs.readFileSync('_layout2.html', 'utf8');

    var pattern = /\^_\w+\.html\^/g;
    var partials = layout.match(pattern) || [];
    for (var i = 0; i < partials.length; i++) {
        // ^_head.html^
        var partial = partials[i];
        var partialFile = partial.replace(/\^/g,'');
        var partialContents = fs.readFileSync(partialFile, 'utf8');
        console.log('replacing ' + partial + ' with ' + partialContents);
        layout = layout.replace(partial, partialContents);
    }
    
    // create index.html with contents of layout
    fs.writeFile('_index.html', layout);
    return;
});

gulp.task('default', ['less']);
    
gulp.task('deploy', function() {
    runSequence('less','replace');
});

gulp.task('watch', function () {
    gulp.watch('./*.less', ['less']);
});