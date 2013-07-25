function profile( username , selector ) {

    user = new StackMob.User({ username: username });
    user.fetch({
        success: function(model) {
            $( selector ).empty();
             console.log(selector);
            $(selector).append('<h1>Profile</h1><table class="table table-bordered"></table>');

            $.each(model.toJSON(), function(key, value) {

                $("#content table").append("<tr><td>" + key + ":</td><td>" + value + "</td></tr>")

            });
        },
        error: function(model, response ) {
            console.log("Unable to fetch user information for profile.");
        }
    });
}