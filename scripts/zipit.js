var zipFolder = require('zip-folder');

zipFolder(__dirname + '/../dist', __dirname + '/../demoit.zip', function (err) {
  if (err) {
    console.log('Zipping extension failed.', err);
  } else {
    console.log('Zipping extension successful.');
  }
});
