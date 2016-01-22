var gulp = require('gulp'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    prompt = require('gulp-prompt'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version'),
    shell = require('gulp-shell'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    eslint = require('gulp-eslint'),
    Server = require('karma').Server;

var pkg = require('./package.json');

var entry = 'index.js',
    standaloneName = 'reactI18next',
    output = 'index.js';

function compile(watch) {
  var bundler = browserify('./src/' + entry, { debug: argv.debug, standalone: standaloneName }).transform(babelify);
  bundler.external('react');
  if (watch) {
    bundle = watchify(bundler);
  }

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(output))
      .pipe(buffer())
      .pipe(gulpif(!argv.debug, uglify()))
      .pipe(gulpif(argv.debug, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(argv.debug, sourcemaps.write('./')))
      .pipe(gulp.dest('./bin'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  return rebundle();
}

gulp.task('eslint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    reporters: [ 'spec', 'coverage' ],
  }, done).start();
});

gulp.task('test_compat', function (done) {
  new Server({
    configFile: __dirname + '/karma.backward.conf.js'
  }, done).start();
});


gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('babel', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./lib'));
});

gulp.task('rename', ['concat', 'babel'], function () {
  return gulp
    .src('./bin/index.js')
    .pipe(rename('./' + standaloneName + '.min.js'))
    .pipe(gulp.dest('./'));
});


function inc(version) {
  if (!version) return;

  var type, tag;

  if (version.indexOf('.') < 0) {
    if (version === 'major' || version === 'minor' || version === 'patch') {
      type = version;
    } else {
      tag = version;

      var parts = pkg.version.split('-');
      if (parts.length > 1) {
        var tagVersion = 0;
        var p = parts[1].split('.');
        if (p[0] === tag) tagVersion = parseInt(p[1], 10) + 1;
        version = parts[0] + '-' + tag  + '.' + tagVersion;
      } else {
        version = pkg.version + '-' + tag  + '.0';
      }
    }
  }

  function cb(obj) {
    var stream = new require('stream').Transform({objectMode: true});
    stream._transform = function(file, unused, callback) {
      obj();
      callback(null, file);
    };
    return stream;
  }

  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe(type ? bump({type: type}) : bump({version: version}))
    // save it back to filesystem
    .pipe(gulp.dest('./'))

    // commit change
    .pipe(git.commit('bumps package version'))

    // read only one file to get the version number
    .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tag_version({prefix: ''}))

    // push tag
    .pipe(prompt.confirm({
        message: 'Push tag ' + version + ' to github?',
        default: false
    }))
    .pipe(cb(function() {
      git.push('origin','master', {args: ' --tags'}, function (err) {
        if (err) throw err;
      });
    }))

    // npm publish
    .pipe(prompt.confirm({
        message: 'publish ' + version + ' to npm?',
        default: false
    }))
    .pipe(shell([
      'npm publish --tag ' + (tag ? tag : 'latest')
    ]));
}

function watch() {
  return compile(true);
};

gulp.task('concat', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('bump', function() { return inc(argv.v); });

gulp.task('default', ['watch']);
gulp.task('build', ['concat', 'babel', 'rename']);
gulp.task('publish', ['bump']);
