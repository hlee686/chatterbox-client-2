// YOUR CODE HERE:

  var server = 'https://api.parse.com/1/classes/chatterbox';
  var database = [];
  var timestamp = '2016-03-14T23:54:39.914Z';


  var postMsg = function(message) { 
    $.ajax({
      url: server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  };

  var message = {
    username: 'Julie Newmar',
    text: 'I am Cat Woman, hisssss',
    roomname: 'batman'
  };

  postMsg(message);



  var getMsg = function(message) { 
    $.ajax({
      url: server, 
      type: 'GET',
      data: { order: '-createdAt',  // ?order=-createdAt',
              where: { 
                createdAt: { $gt: { __type: 'Date', iso: timestamp } } 
              }
            },            
      contentType: 'application/json',
      success: function (data) {
        database = data.results.slice().concat(database);
        timestamp = database[0].createdAt;
        trytry();
        console.log('chatterbox: Message retrieved. Data: ', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to get data. Error: ', data);
      }
    });
  };

  getMsg();

  var roomlist = {};

  var trytry = function() {
    for (var i = 0; i < database.length; i++) {
      roomlist[database[i].roomname] = null;
    }
    for (var key in roomlist) {
      $('#room-select').append('<option value="' + key + '">' + key + '</option>');
    }
  };

  $('.submit').click(function(e) {
    postMsg({
      username: 'Julie Newmar',
      text: $('.text').val(),
      roomnaRme: 'batman'
    });
  });










