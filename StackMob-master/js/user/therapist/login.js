function login() {

	var username = $( "[name='username']" ).val();
	var password = $( "[name='password']" ).val();

    user = new StackMob.User( {
        username: username,
        password: password
    } );

    therapist = StackMob.Model.extend({
        schemaName: 'therapist'
    });

    var therapists = new therapist();

    var q = new StackMob.Collection.Query();
    q.equals('username', username);
    therapists.query(q, {
        success: function(collection) {

            if( typeof( collection["attributes"][0] ) == "object" ) {
                user.login( false, {
                    success: function( model ) {
                        window.location = "dashboard.html";
                    },
                    error: function( model, response ) {
                        $( "#result" ).html( "<b>Invalid username and / or password.</b>" );
                        $( "#error").show();
                        setTimeout( "$( '#error').hide();", 2000 );
                    }
                } );
            }
            else {
                $( "#result" ).html( "<b>User is not a therapist.</b>" );
                $( "#error").show();
                setTimeout( "$( '#error').hide();", 2000 );
            }


        },
        error: function( model, response ) {
            $( "#result" ).html( "<b>Unable to query therapist table.</b>" );
            $( "#error").show();
            setTimeout( "$( '#error').hide();", 2000 );
        }
    });
}



