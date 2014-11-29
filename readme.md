# gulp-html-handlebars
Forked from [gulp-template](https://github.com/kaanonm/gulp-compile-handlebars).
This fork does not depend on handlebars anymore.

> Compile [Handlebars templates](http://www.handlebarsjs.com/)

## Install

Install with [npm](https://npmjs.org/package/gulp-handlebars-html)

```
npm install --save-dev handlebars gulp-handlebars-html
```

## Example

### `src/hello.handlebars`

```handlebars
{{> partials/header}}
<p>Hello {{firstName}}</p>
<p>HELLO! {{capitals firstName}}</p>
{{> footer}}
```

### `src/partials/header.handlebars`

```handlebars
<h1>Header</h1>
```

### `gulpfile.js`

```js
var gulp = require('gulp');
var handlebars = require('handlebars');
var gulpHandlebars = require('gulp-compile-handlebars')(handlebars); //default to require('handlebars') if not provided
var rename = require('gulp-rename');

handlebars.registerPartial('footer', '<footer>the end</footer>');
handlebars.registerHelper('capitals', function(str){
  return str.toUpperCase();
});

gulp.task('default', function () {
	var templateData = {
		firstName: 'Kaanon'
	},
	options = {
		partialsDirectory : ['./src/partials']
	}

	return gulp.src('src/hello.handlebars')
		.pipe(gulpHandlebars(templateData, options))
		.pipe(rename('hello.html'))
		.pipe(gulp.dest('dist'));
});
```

### `dist/hello.html`

```html
<h1>Header</h1>
<p>Hello Kaanon</p>
<p>HELLO! KAANON</p>
<footer>the end</footer>
```

## Options
- __allowedExtensions__ (['hb', 'hbs', 'handlebars', 'html']) : Array of allowed extensions for templates
- __partialsDirectory__ ([]) : Array of filepaths to use as partials

## Works with gulp-data

Use gulp-data to pass a data object to the template based on the handlebars file being processed.
If you pass in template data this will be extended with the object from gulp-data.

See [gulp-data](https://www.npmjs.org/package/gulp-data) for usage examples.

## License

MIT