let locationName;
let coords; 


// When edit button clicked, change to edit mode
$('#edit-button').click(function (event) {
    event.preventDefault(); 
    $('.edit-form').removeClass('hidden');
    $('.view-card').addClass('hidden'); 
    isEditMode = true; 
});

// When save button clicked, change to view mode
$('#save-button').click(function (event) {
    event.preventDefault();
    $('.edit-form').addClass('hidden');
    $('.view-card').removeClass('hidden');
    codeAddress(function () {

        // get all the new tags 
        var tags = $('.taglist-edit').children();
        var tagList = []; 
        for (var i = 0; i < tags.length; ++i) {
            tagList.push($(tags[i]).text().split(' ')[0]); 
        }
        console.log(coords.lat(), coords.lng()); 
        let imageData;
        if (uploadImage) {
            let reader = new FileReader();
            reader.onload = function(event) {

                var userFormData = {
                    'name': $('#name').val(), 
                    'email': $('#email').val(),
                    'description': $('#description').val(),
                    'tags': tagList,
                    'education': $('#education').val(),
                    'location': locationName,
                    'lat': coords.lat,
                    'lng': coords.lng,
                    'image': event.target.result.split(',')[1]
                };   

                $.ajax({
                    url: "/users",
                    type: 'patch',
                    data: userFormData,
                    success: function(data, status) {    
                        $('#name-view').text(data.name);
                        $('#email-view').text(data.email);
                        $('#location-view').text(data.location.name);
                        $('#description-view').text(data.description);
                        $('#education-view').text(data.education);
                        $('.taglist-view').empty();
                        for (var i = 0; i < data.tags.length; ++i) { 
                            var newTag = $('<span>').addClass('tag').text(data.tags[i]);
                            $('.taglist-view').append(newTag); 
                        } 
                    }
                });
            }

            reader.readAsDataURL(uploadImage);  
        } else {

            imageData = $('.profile-image')[0].currentSrc.split(',')[1]; 
            var userFormData = {
                'name': $('#name').val(), 
                'email': $('#email').val(),
                'description': $('#description').val(),
                'tags': tagList,
                'education': $('#education').val(),
                'location': locationName,
                'lat': coords.lat,
                'lng': coords.lng,
                'image': imageData
            };   

            $.ajax({
                url: "/users",
                type: 'patch',
                data: userFormData,
                success: function(data, status) {   
                    $('#name-view').text(data.name);
                    $('#email-view').text(data.email);
                    $('#location-view').text(data.location.name);
                    $('#description-view').text(data.description);
                    $('#education-view').text(data.education);
                    $('.taglist-view').empty();
                    for (var i = 0; i < data.tags.length; ++i) { 
                        var newTag = $('<span>').addClass('tag').text(data.tags[i]);
                        $('.taglist-view').append(newTag); 
                    }
                }
            });
        }
        isEditMode = false;
    });

});

$('#delete-button').click(function (event) {
    event.preventDefault();
    $.ajax({
        url: "/users",
        dataType: 'text',
        type: 'delete',
        success: function (data, status) {
            window.location.replace('/'); 
        }
    })
})

// Add tags in edit mode
$('#tag').keyup(function (event) {
    if (event.keyCode == 32) {
        var tagDelete = $('<span>').addClass('tag-delete').text('x');
        var tag = $('<span>').addClass('tag').text($(this).val() + ' ').append(tagDelete); 
        $('.taglist-edit').append(tag); 
        $(this).val(''); 
    }
});

// use event delegation to delete tags
$('.taglist-edit').on('click', '.tag-delete', function () {
    $(this).parent().remove(); 
})