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
                    var name = $('<h3>').addClass('card-title').attr('id', 'name-view').text(user.name); 
                    var description = $('<p>').addClass('card-text').attr('id', 'description-view').text(user.description); 
                    
                    var fullCardBody = cardBody.append(name, description); 
                    var fullCard = card.append(imageWithLink, fullCardBody); 
                    var userCard = container.append(fullCard);
                    
                    $('.user-list').append(userCard); 
                }
            }
        });
    }
});