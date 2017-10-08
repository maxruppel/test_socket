var app   = require('express')();
var http  = require('http').Server(app);
var io    = require('socket.io')(http);
var port  = 9000;

var users = [];
var counter = 0;
var messages = [];


app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  //New user
  if (!users[socket.id]) {
    users[socket.id] = {"name": "user"+counter};
    socket.emit('chat message', 'Willkommen');
    for (let i = 0; i < messages.length; i++) {
      socket.emit('chat message', messages[i]);
    }
    counter++;
  }

  //Disconnect
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //Message sent
  socket.on('chat message', function(msg){
    console.log(messages);
    //console.log(socket);
    //console.log('message: ' + msg);
    let user = users[socket.id];
    let timestamp = new Date();
    let newMsg = timestamp.toLocaleString() +' – ' + user.name + ': ' + msg;
    messages.push(newMsg);
    io.emit('chat message', newMsg);
  });
});

http.listen(port, function(){
  let text = 'listening on port '+port;
  console.log(text);
});
