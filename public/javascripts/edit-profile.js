// When edit button clicked, change to edit mode
$('#edit-button').click(function (event) {
    event.preventDefault(); 
    $('.edit-form').removeClass('hidden');
    $('.view-card').addClass('hidden'); 
});

// When save button clicked, change to view mode
$('#save-button').click(function (event) {
    $('.edit-form').addClass('hidden');
    $('.view-card').removeClass('hidden');
    event.preventDefault();
    
    // get all the new tags 
    var tags = new Array($('.taglist-edit').children().map(function (index, element) {
        return $(element).text().split(' ')[0];  
    })); 
    tags.pop(); 

    var userFormData = JSON.stringify({
        'name': $('#name').val(), 
        'email': $('#email').val(),
        'description': $('#description').val(),
        'tags': tags,
        'education': $('#education').val(),
        'location': $('#location').val()
    });

    console.log(tags); 
 
    $.ajax({
        url: "http://localhost:3000/users",
        dataType: 'text',
        type: 'patch',
        contentType: 'application/json',
        data: userFormData,
        success: function(data, status) {
            data = JSON.parse(data);  
            $('#name-view').text(data.name);
            $('#email-view').text(data.email);
            $('#location-view').text(data.location);
            $('#description-view').text(data.description);
            $('#education-view').text(data.description);  
        }
    });
});

$('#delete-button').click(function (event) {
    event.preventDefault();
    $.ajax({
        url: "http://localhost:3000/users",
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
$('.taglist').on('click', '.tag-delete', function () {
    $(this).parent().remove(); 
})