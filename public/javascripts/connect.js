// POST Send Invite
$('.connect-button').on('click', function(event) {
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

// POST Accept Invite
$('.accept-button').on('click', function(event) {
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