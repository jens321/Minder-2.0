// reset the unread messages
$(function() {
    $.ajax({
        url: '/users/chat/reset',
        type: 'patch'
    });
});


$('#message-bar').on('keyup', function (event) { 
    let value = $(this).val().trim();
    if (event.keyCode == 13 && value !== '') { 
        let message = $('<p>').addClass('message sent').text(value); 
        $('.message-area').append(message); 
        $('.message-area')[0].scrollTop = $('.message-area')[0].scrollHeight;
        $(this).val(''); 
        let chatData = {
            'receiver': $('.selected').attr('data-id'),
            'message': value
        };
        $.ajax({
            url: '/users/chat/:id',
            type: 'post',
            data: chatData
        }).then(function(result) {
            // do something with the result 
        }).catch(function (err) {
            console.log(err); 
        })
    }
});

$('.connection-list').on('click', '.connection', function (event) {
    $(this).siblings().removeClass('selected');
    $(this).addClass('selected'); 

    $('.message-area').empty();   

    let receiverId = $(this).attr('data-id'); 

    // load message history in here 
    $.ajax({
        url: '/users/chat/history',
        type: 'get',
        data: {
            'receiver': receiverId
        }
    }).then(function (result) {
        result.forEach(function (message) {
            let value = message.message; 
            if (message.receiver == receiverId) {
                let newMessage = $('<p>').addClass('message sent').text(value); 
                $('.message-area').append(newMessage); 
            } else {
                let newMessage = $('<p>').addClass('message received').text(value); 
                $('.message-area').append(newMessage); 
            }
        }); 
        $('.message-area')[0].scrollTop = $('.message-area')[0].scrollHeight;
    }).catch(function (err) {
        console.log(err); 
    });
});

