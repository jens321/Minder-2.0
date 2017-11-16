$('.connect-button').on('click', function(event) {
    var id = $(this).parent().children().first().attr('data-id'); 
    $.ajax({
        url: `/users/connect/${id}`,
        type: 'post'
    }).then(function (result) {
        // do something
    }).catch(function (err) {
        console.log(err); 
    })
});