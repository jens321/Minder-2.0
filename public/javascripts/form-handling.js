$('#signup-submit-button').click(function (event) {
    event.preventDefault(); 
    $.ajax({
        url: "http://localhost:3000/users/signup",
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            'name': $('#signup-name').val(), 
            'email': $('#signup-email').val(), 
            'password': $('#signup-password').val()
        }),
        success: function(data, status) {
            console.log(data); 
            window.location.replace('/profile'); 
        }
    });
});

$('#login-submit-button').click(function (event) {
    event.preventDefault();
    $.ajax({
        url: "http://localhost:3000/users/login",
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            'email': $('#login-email').val(),
            'password': $('#login-password').val()
        }),
        success: function(data, status) {
            console.log(data); 
            window.location.replace('/profile'); 
        }
    })
});