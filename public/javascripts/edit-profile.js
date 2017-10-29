// When edit button clicked, change to edit mode
$('#edit-button').click(function () {
    $('.edit-form').removeClass('hidden');
    $('.view-card').addClass('hidden'); 
});

// When save button clicked, change to view mode
$('#save-button').click(function (event) {
    $('.edit-form').addClass('hidden');
    $('.view-card').removeClass('hidden');
    event.preventDefault(); 
    $.ajax({
        url: "http://localhost:3000/users",
        dataType: 'json',
        type: 'patch',
        contentType: 'application/json',
        data: JSON.stringify({
            'name': $('#name').val(), 
            'email': $('#email').val()
        }),
        success: function(data, status) {
            console.log(data); 
        }
    });
});

// Add tags in edit mode
$('#tag-input').keyup(function (event) {
    if (event.keyCode == 32) {
        var tagDelete = $('<span>').addClass('tag-delete').text('x');
        var tag = $('<span>').addClass('tag').text($(this).val() + ' ').append(tagDelete); 
        $('.taglist').append(tag); 
        $(this).val(''); 
    }
});

// use event delegation to delete tags
$('.taglist').on('click', '.tag-delete', function () {
    $(this).parent().remove(); 
})