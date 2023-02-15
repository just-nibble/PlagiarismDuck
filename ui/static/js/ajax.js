function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
        $('#loader').removeClass('hidden');
        $("#results").empty();
        $('#submit_btn').prop('disabled', true);
    }
});


function check_paragraph() {
    console.log("create post is working!") // sanity check
    $.ajax({
        url : "check_paragraph/", // the endpoint
        type : "POST", // http method
        data : { the_paragraph : $('#paragraph-text').val() }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#paragraph-text').val(''); // remove the value from the input
            console.log(json); // log the returned json to the console
            
            if (json.length > 0){
                for(i=0; i<10; i++){
                    $("#results").prepend("<li><div class='list nm-aic'><div class='icon'><i class='fas fa-briefcase'></i></div><div class='content'><p><a href="+json[i].link+">"+json[i].title+"</a></p></div></div></li>");
                }
            }else{
                $("#results").prepend(
                    "<li><div class='list nm-aic'><div class='icon'><i class='fas fa-briefcase'></i></div><div class='content'><p>No results found</p></div></div></li>"
                )
            }
            
            console.log("success"); // another sanity check
            
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            $('#loader').addClass('hidden');
            $('#submit_btn').prop('disabled', false);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+xhr.responseText+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};


$('#paragraph-form').on('submit', function(event){
    event.preventDefault();
    console.log("form submitted!")  // sanity check
    check_paragraph();
});