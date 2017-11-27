socket.on('notification', function(newNote) {
    if (newNote.type === "new_message") {
        let message = $('<div>').addClass('alert alert-info').attr('role', 'alert').text(`New message from ${newNote.sender}`);
        $('.notifications').append(message);
        message.hide().fadeIn().delay(800).fadeOut(300, function() {
            $('.notifications').empty(); 
        }); 
        let messageCounter = $('#message-counter'); 
        let messageCounterValue = messageCounter.text();  
        if (messageCounterValue !== "") {
            messageCounter.text(parseInt(messageCounterValue)+ 1)
        } else { 
            let messageCounter = $('<span>').attr('id', 'message-counter').text("1"); 
            $('#chat-nav-link').append(messageCounter); 
        }
    }
    else if (newNote.type === "new_connection") {
        let message = $('<div>').addClass('alert alert-warning').attr('role', 'alert').text(`${newNote.sender} wants to connect.`);
        $('.notifications').append(message);
        message.hide().fadeIn().delay(800).fadeOut(500, function() {
            $('.notifications').empty(); 
        });  
    }
});