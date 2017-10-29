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
});