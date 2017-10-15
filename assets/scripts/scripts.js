    var socket = io.connect('http://stark-caverns-4785.herokuapp.com/');


  socket.on('connect', function(){



socket.emit('adduser', prompt("What's your name?"));
       
    });

	socket.on('updaterooms',function(rooms)
{

$('#rooms').empty();


$.each(rooms,function(key,value)
{

$('#rooms').append("<option value=" + value + ">"+value+"</option>");

});


});


socket.on('changeRoomName',function(room)
{
   $('.room').empty();
  $('.room').append("<h1>"+room+"</h1>");


});



    socket.on('updatechat', function (username, data,now,color,room) {
   $('#conversation').append("<p><span class='label label-info'> " + now +"</span>" +' - <span class="label label-success">' +username + '</span>' + " <font color='" +color +"'>"+data+"</font></p>")
$('#conversation').emoticonize();


   });



    socket.on('updateusers',function(data){
	$('#users').empty();
	$.each(data,function(key,value)
{

$('#users').append("<option value=" + value + "> "+value+"</p>");

});
	


	});



    $(function(){



      $('#datasend').click( function() {
            var message = $('#data').val();
            $('#data').val('');

            socket.emit('sendchat', message);
	$('#data').focus();
        });
	

	$('#data').keypress(function(key)
{

if(key.which==13)
{

$('#datasend').focus().click();
}

	$('#data').focus();
});

$('#color').change(function(){
var color=$('#color').val();
socket.emit('color',color);


});

$('#rooms').change(function()
{
if(confirm('Do you want to switch rooms?'))
{
var newroom=$('#rooms').val();

socket.emit('switchRoom',newroom);

}
});


$('#showModal').click(function(e)
{

	e.preventDefault();
$('#toggleOverlay').show();
	$('#modal').fadeIn(300);



});


$('#closeModal').click(function(e)
{
	e.preventDefault();
	$('#toggleOverlay').hide();

	$('#modal').fadeOut(300);



});

	
    });


