var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var extend = require('util')._extend;

module.exports = function(Handlebars){
  if (!Handlebars)
    Handlebars = require('handlebars');
  return function (data, opts) {

    var options = opts || {};

    var maxDepth = 10;
    var allowedExtensions = options.allowedExtensions || ['hb', 'hbs', 'handlebars', 'html'];

    var isDir = function (filename) {
      var stats = fs.statSync(filename);
      return stats && stats.isDirectory();
    };

    var isHandlebars = function (filename) {
      return allowedExtensions.indexOf(filename.split('.').pop()) !== -1;
    };

    var partialName = function (filename, base) {
      var name = filename.substr(0, filename.lastIndexOf('.'));
      name = name.replace(new RegExp('^' + base + '\\/'), '');
      return name;
    };

    var registerPartial = function (filename, base) {
      if (!isHandlebars(filename)) { return; }
      var name = partialName(filename, base);
      var template = fs.readFileSync(filename, 'utf8');
      Handlebars.registerPartial(name, template);
    };

    var registerPartials = function (dir, base, depth) {
      if (depth > maxDepth) { return; }
      base = base || dir;
      fs.readdirSync(dir).forEach(function (basename) {
        var filename = dir + '/' + basename;
        if (isDir(filename)) {
          registerPartials(filename, base);
        } else {
          registerPartial(filename, base);
        }
      });
    };

    if(options.partialsDirectory){
      if(typeof options.partialsDirectory === 'string') 
        options.partialsDirectory = [options.partialsDirectory];

      options.partialsDirectory.forEach(function (dir) {
        registerPartials(dir, dir, 0);
      });
    }

    return through.obj(function (file, enc, cb) {
      var _data = extend({}, data);

      if (file.isNull()) {
        this.push(file);
        return cb();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('gulp-handlebars-html', 'Streaming not supported'));
        return cb();
      }

      try {
        var fileContents = file.contents.toString();

        // Enable gulp-data usage, Extend default data with data from file.data
        if(file.data){
          _data = extend(_data, file.data);
        }
        var template = Handlebars.compile(fileContents);
        file.contents = new Buffer(template(_data));
      } catch (err) {
        this.emit('error', new gutil.PluginError('gulp-handlebars-html', err));
      }

      this.push(file);
      cb();
    });
  };
};
