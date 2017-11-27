$('#search-bar').on('keyup', function (event) { 
    if (event.target.value.trim() === '') {
        $('.user-list').empty(); 
    } else {
        $.ajax({
            url: `/search/${event.target.value}`,
            type: 'get',
            success: function (data) {
                $('.user-list').empty(); 
                for (var i = 0; i < data.length; ++i) {
                    user = data[i]; 
                    var container = $('<div>').addClass('col-md-4');
                    var card = $('<div>').addClass('card').addClass('view-card'); 
                    var image = $('<img>').addClass('card-img-top').attr('src', user.imageUrlPath); 
                    var profileLink = $('<a>').attr('href', `/users/${user._id}`); 
                    var imageWithLink = profileLink.append(image); 
                    var cardBody = $('<div>').addClass('card-body'); 
                    var name = $('<h3>').addClass('card-title name-view').attr('data-id', user._id).text(user.name); 
                    var description = $('<p>').addClass('card-text description-view').text(user.description);
                    let invite = $('<button>').addClass('btn btn-primary connect-button').text("Send Invite"); 
                    
                    var fullCardBody = cardBody.append(name, description, invite); 
                    var fullCard = card.append(imageWithLink, fullCardBody); 
                    var userCard = container.append(fullCard);
                    
                    $('.user-list').append(userCard); 
                }
            }
        });
    }
});