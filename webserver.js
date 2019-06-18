var http = require('http');
var path = require('path');
var fs = require('fs');
var random = require('random');
var express = require('express');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();
app.use('/api', router);

function swap(array, idx1, idx2) {
  var temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;
}

var getFilenameFromNetworkRecursive = function(file) {
  var stat = fs.statSync(file);
  if (stat.isFile()) {
    return (/\.jpg/i).test(file) ? file : null;
  }

  var contents = fs.readdirSync(file);
  var length = contents.length;

  while (length > 0) {
    var idx = random.int(0, length - 1);
    var child = path.join(file, contents[idx]);
    var result = getFilenameFromNetworkRecursive(child);
    if (result !== null && result !== undefined) {
      return result;
    }

    swap(contents, idx, length - 1);
    length--;
  }

  return null;
}

var getImageFile = function() {
  var rootFolder = '<your root folder>';
  return getFilenameFromNetworkRecursive(rootFolder);
};

router.route('/image')
  .get(function(request, response) {
    var file = getImageFile();
    if (file == null || file === undefined){
      response.status(404);
      response.send('Not Found');
      return;
    }
    var stat = fs.statSync(file);
    response.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': stat.size
    });
    stream = fs.createReadStream(file);
    stream.pipe(response);
  });

var httpServer = http.createServer(app);
httpServer.listen(8000);
