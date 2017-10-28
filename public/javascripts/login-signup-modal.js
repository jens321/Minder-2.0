// When page is loaded, hide the forms
$('.signup-form, .login-form').hide(); 

// Signup button clicked => signup-modal
$('#signup-button').click(function () {
    $('.signup-form').fadeIn(); 
    $('.login-form').hide();  
});

// Login button clicked => login-modal
$('#login-button').click(function () {
    $('.signup-form').hide(); 
    $('.login-form').fadeIn();   
});