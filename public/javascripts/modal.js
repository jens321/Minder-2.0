let profileUrlPath = $('.profile-image').val(); 
let uploadImage; 
let isEditMode = false; 

// When page is loaded, hide the forms
$('.signup-form, .login-form').hide(); 

// Signup button clicked => signup-modal
$('#signup-button').click(function () {
    $('.signup-form').slideDown(); 
    $('.login-form').hide();  
});

// Login button clicked => login-modal
$('#login-button').click(function () {
    $('.signup-form').hide(); 
    $('.login-form').slideDown();   
});

$('.profile-image').click(function() {
    if (isEditMode) {
      $('.modal').modal(); 
      openWebCamModal(); 
    }
});

// When modal closes, stop streaming webcam
$('.modal').on('hide.bs.modal', function (event) {
    MediaStream.stop();
});

// Only when save button is clicked the picture is saved
$('#modal-save-button').click(function () {
    $('.profile-image').attr('src', profileUrlPath); 
    $('.modal').modal('hide'); 
});

// wrap the input file click event in a button
$('#upload-button').click(function () {
    $('#upload-input').click(); 
});

// if the input file event has changed, change the src of the profile image
$('#upload-input').change(function (event) {
    $('.modal').modal('hide'); 
    $('.profile-image').attr('src', URL.createObjectURL(event.target.files[0]));   
    uploadImage = event.target.files[0]; 
});

var openWebCamModal = function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
  
      navigator.getMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);
                             
      navigator.getMedia(
        {
          video: true,
          audio: false
        },
        function(stream) {
          if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
            MediaStream = stream.getTracks()[0];
          } else {
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
            MediaStream = stream.getTracks()[0];
          }
          video.play();
        },
        function(err) {
          console.log("An error occured! " + err);
        }
      );
  
      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (4/3);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
        $('#upload-input').val(''); 
      }, false);
      
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
      
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        profileUrlPath = data;
        uploadImage = undefined;   
      } else {
        // clearphoto();  
      }
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    startup(); 
  }; 
  