// YOUR CODE HERE:
var app;

$(function() {
  app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'natoen',
    room: 'lobby',
    friends: {},

    init: function() {
      app.username = window.location.search.substr(10);
      app.$main = $('#main');
      app.$roomSelect = $('#room-select');
      app.$text = $('#text');
      app.$send = $('#send');
      app.$chatbox = $('#chatbox');

      app.$roomSelect.on('change', app.saveRoom);
      app.$send.on('submit', app.handleSubmit);
      app.$main.on('click', '.username', app.addFriend);

      app.fetch();

      setInterval(app.fetch, 2000);
    },

    saveRoom: function(event) {
      var selectedIndex = app.$roomSelect.prop('selectedIndex');

      if (selectedIndex === 0) {
        var roomname = prompt('Enter room name:');
        if (roomname) {
          app.room = roomname;
          app.addRoom(roomname);
          app.$roomSelect.val(roomname);
          app.fetch();
        }
      } else {
        app.room = app.$roomSelect.val();
        app.fetch();
      }
    },

    send: function(message) { 
      app.startSpinner();

      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          app.fetch();
          console.log('chatterbox: Message sent. Data: ', data);
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message. Error: ', data);
        },
        complete: function() {
          app.stopSpinner()     ;   
        }   
      });
    },

    fetch: function() { 
      app.startSpinner();

      $.ajax({
        url: app.server, 
        type: 'GET',
        contentType: 'application/json',
        data: { order: '-createdAt',  // ?order=-createdAt',
                // where: { 
                //   createdAt: { $gt: { __type: 'Date', iso: timestamp } } 
                // }
              },
        success: function (data) {
          app.populateRooms(data.results);
          app.populateMessages(data.results);
          console.log('chatterbox: Message retrieved. Data: ', data);
        },
        error: function (data) {
          console.error('chatterbox: Failed to get data. Error: ', data);
        },
        complete: function() {
          app.stopSpinner()     ;   
        }          
      });
    },

    startSpinner: function() {
      $('.spinner').show();
    },

    stopSpinner: function() {
      $('.spinner').hide();
    },

    populateRooms: function(results) {
      app.$roomSelect.html('<option value="newroom">New Room..</option><option value="lobby" selected>Lobby</option>');


      if(results) {
        var processedRooms = {};

        if (app.room !== 'lobby') {
          app.addRoom(app.room);
          processedRooms[app.room] = true;
        }
        
        results.forEach(function(data){
          var roomname = data.roomname;
          if (roomname && !processedRooms[roomname]) {
            app.addRoom(roomname);
            processedRooms[roomname] = true;
          }
        });
      }

      app.$roomSelect.val(app.room);
    },

    populateMessages: function(results) {
      app.clearMessages();

      if(Array.isArray(results)) {
        results.forEach(app.addMessage);
      }
    },

    clearMessages: function(){
      app.$chatbox.html('');
    },

    addMessage: function(data) {
      if (!data.roomname) {
        data.roomname = 'lobby';
      }

      if (data.roomname === app.room) {
        var $chatbox = $('<div class="chatbox" />');
        var $username = $('<span class="username" />');
        $username.text(data.username + ': ')
          .attr('data-username', data.username)
          .attr('data-roomname', data.roomname)
          .appendTo($chatbox);

        if (app.friends[data.username] === true) {
          $username.addClass('friend');
        }

        var $text = $('<br /><span />');
        $text.text(data.text)
          .appendTo($chatbox);

        app.$chatbox.append($chatbox);
      }
    },

    addRoom: function(roomname) {
      var $option = $('<option />').val(roomname).text(roomname);

      app.$roomSelect.append($option);
    },

    handleSubmit: function(event) {
      event.preventDefault();

      var message = {
        username: app.username,
        text: app.$text.val(),
        roomname: app.room || 'lobby'
      };

      app.send(message);
    },

    addFriend: function(event) {
      var username = $(event.currentTarget).attr('data-username');
      if (username !== undefined) {
        console.log('Addding %s as a friend', username);

        app.friends[username] = true;

        var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
        $(selector).addClass('friend');
      }
    }
  };
});