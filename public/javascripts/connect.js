// POST Send Invite
$('.user-list').on('click', '.connect-button',function(event) {
    $(this).parent().parent().fadeOut(300, function() { 
        $(this).parent().addClass('hidden');  
    }); 
    let id = $(this).parent().children().first().attr('data-id'); 
    $.ajax({
        url: `/users/connect/${id}`,
        type: 'post'
    }).then(function (result) {
        // pass 
    }).catch(function (err) {
        console.log(err); 
    })
});

// PATCH Accept Invite
$('.accept-button').on('click', function(event) {
    $(this).parent().parent().fadeOut(); 
    let id = $(this).parent().children().first().attr('data-id');
    $.ajax({
        url: `/users/connect/accept/${id}`,
        type: 'patch'
    }).then(function (result) {
        // pass 
    }).catch(function (err) {
        console.log(err); 
    });
});

// PATCH Cancel Invite
$('.cancel-request-button').on('click', function(event) {
    $(this).parent().parent().fadeOut();
    let id = $(this).parent().children().first().attr('data-id');
    $.ajax({
        url: `/users/connect/cancel/${id}`,
        type: 'patch'
    }).then(function(result) {
        // pass 
    }).catch(function(err) {
        console.log(err);
    });
});