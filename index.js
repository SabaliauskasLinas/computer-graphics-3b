const express = require('express');
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const path = require("path");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

const app = express();

app.use(connectLivereload());

app.use(express.static(__dirname + '/public'));
var port = 8000;
app.listen(port, () => {
  console.log(`APp listening on port ${port}!`)
});