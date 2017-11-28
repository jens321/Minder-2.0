$('#signup-submit-button').click(function (event) {
    event.preventDefault(); 
    $.ajax({
        url: "/users/signup",
        type: 'post',
        data: {
            'name': $('#signup-name').val(), 
            'email': $('#signup-email').val(), 
            'password': $('#signup-password').val()
        },
        success: function(data, status) {
            window.location.replace('/profile'); 
        }
    });
});

$('#login-submit-button').click(function (event) {
    event.preventDefault();
    $.ajax({
        url: "/users/login",
        type: 'post',
        data: {
            'email': $('#login-email').val(),
            'password': $('#login-password').val()
        },
        success: function(data, status) {
            if (data === "success") {
                $('.error-messages').empty();
                window.location.replace('/profile');
            }  else {
                $('.error-messages').empty();
                let err = $('<div>').addClass('alert alert-danger').text(data);
                $('.error-messages').append(err); 
            }
        }
    })
});