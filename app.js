var express=require('express'),
app=express();
var server=require('http').createServer(app),
io=require('socket.io').listen(server);

app.use("/assets",express.static(__dirname + '/assets'));
var moment=require('moment');
format="h:mm:ss a"
var port = process.env.PORT || 5000;
server.listen(port);




var usernames={};
var rooms=['Lobby',"Asia","America"];



app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/chat.html');
});

app.get('/',function(req,res)
{

  res.sendfile(__dirname+'/index.html');

});


app.get('/smileys',function(req,res)
{

  res.sendfile(__dirname+'/smileys.html');

});

io.sockets.on('connection',function(socket)
{
  socket.color="black";
  socket.on('sendchat',function(data)
  {
    var date=moment().format(format);

    io.sockets.in(socket.room).emit('updatechat',socket.username,data,date,socket.color);

  });

  socket.on('color',function(message){


    socket.color=message;

  });

  socket.on('adduser',function(username)
  {
    var date=moment().format(format);

    socket.username=username;
    socket.room="Lobby";
    usernames[username]=username;
    socket.join(socket.room);





    socket.emit('updatechat','SERVER','You are connected to '+socket.room +' as '+socket.username,date,socket.color,socket.room);
    socket.broadcast.to(socket.room).emit('updatechat','SERVER',socket.username+' has connected',date,socket.color);

    io.sockets.in(socket.room).emit('updateusers',getRoomUsers(socket.room))

    io.sockets.emit('updaterooms',rooms);
  });






  socket.on('switchRoom',function(room){

    var date=moment().format(format);



    socket.broadcast.to(socket.room).emit('updatechat','SERVER',socket.username+' has disconnected',date,socket.color);
    socket.leave(socket.room);



    io.sockets.in(socket.room).emit('updateusers',getRoomUsers(socket.room));

    socket.room=room;
    socket.join(socket.room);
    socket.emit('updatechat','SERVER','You are connected to '+socket.room+' as '+socket.username,date,socket.color,socket.room);
    socket.emit('changeRoomName',socket.room);
    socket.broadcast.to(socket.room).emit('updatechat','SERVER',socket.username +' has joined this room',date,socket.color,socket.room);


    io.sockets.in(socket.room).emit('updateusers',getRoomUsers(socket.room));


  });



  socket.on('disconnect', function(){
    var date=moment().format(format);

    delete usernames[socket.username];


    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected',date,socket.color);
    socket.leave(socket.room);

    io.sockets.in(socket.room).emit('updateusers', getRoomUsers(socket.room));
  });



});



function getRoomUsers(room){
 var roomUsers={};
 var clients=io.sockets.clients(room);
 for(var i=0;i<clients.length;i++)
  roomUsers[clients[i].username]=clients[i].username;
return roomUsers;


}
