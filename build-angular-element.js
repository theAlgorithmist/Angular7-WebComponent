// after consulting with several devs whose opinion I value, having a build script executed from npm was deemed
// a good way to handle exporting the Angular Element.  this is similar to a lot of stuff you've seen before -
// nothing new under the sun ...
const fs     = require('fs-extra');
const concat = require('concat');

(async function build() {
  // todo make this more general purpose

  // bundles to be concatenated - no further compression is applied at this point
  const files =[
    './dist/rectangle-selector/runtime.js',
    './dist/rectangle-selector/polyfills.js',
    './dist/rectangle-selector/main.js'
  ];

  // WebComponent exported in the 'elements' folder
  await fs.ensureDir('elements');

  try
  {
    await concat(files, 'elements/ng-ngon-component.js');
  }
  catch(err)
  {
    console.log( "ERROR: ", err );
  }

  console.info('Successful creation of Angular WebComponent.');
})();
