'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var handlebars = require('handlebars');
var gulpHandlebars = require('./index');
var template = gulpHandlebars.bind(null, handlebars);

handlebars.registerPartial('header', '<header/>');
handlebars.registerHelper('toLower', function(str) { return str.toLowerCase(); });

it('should compile Handlebars templates', function (cb) {
	var stream = template(
	{
		people: ['foo', 'bar'],
		message: 'BAZ'
	});

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<header/><li>foo</li><li>bar</li> baz');
		cb();
	});

	stream.write(new gutil.File({
		contents: new Buffer('{{> header}}{{#each people}}<li>{{.}}</li>{{/each}} {{toLower message}}')
	}));

	stream.end();
});


it('should compile Handlebars templates with no helpers or partials', function (cb) {
	var stream = template(	{people: ['foo', 'bar']});

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<li>foo</li><li>bar</li>');
		cb();
	});

	stream.write(new gutil.File({
		contents: new Buffer('{{#each people}}<li>{{.}}</li>{{/each}}')
	}));

	stream.end();
});


it('should use file.data if available', function (cb) {
	var stream = template({ foo: 'foo', bar: 'bar' });

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<div>foo BAZ</div>');
		cb();
	});

	var file = new gutil.File({
		contents: new Buffer('<div>{{foo}} {{bar}}</div>')
	});
	file.data = { bar: 'BAZ' };

	stream.write(file);

	stream.end();

});

it('should not require a default data object', function (cb) {
	var stream = template();

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<div>BAZ</div>');
		cb();
	});

	var file = new gutil.File({
		contents: new Buffer('<div>{{foo}}</div>')
	});
	file.data = { foo: 'BAZ' };

	stream.write(file);

	stream.end();

});
