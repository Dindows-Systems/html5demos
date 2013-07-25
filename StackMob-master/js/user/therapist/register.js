function register() {

	var username = $( "[name='username']" ).val();
	var password = $( "[name='password']" ).val();
    var name = $( "[name='name']" ).val();

	user = new StackMob.User( {
		username: username, 
		password: password,
        usertype_id: "2", // hardcoded to Therapist for now.
        displayname: name
	} );
	
	user.create({
		success: function( model ) {

            /*
             * Add to ACL.
             */
            aclrole = StackMob.Model.extend({
                schemaName: 'aclrole'
            });

            var entries = new aclrole({
                aclrole_id: "therapists"
            });

            entries.appendAndSave('members', [user.get( 'username' )], {
                success: function(model) {

                    /**
                     * Create a therapist object.
                     */
                    therapist = StackMob.Model.extend({
                        schemaName: 'therapist'
                    });

                    var therapists = new therapist({
                        username: user.get( 'username' )
                    });

                    therapists.create({
                        success: function( model ) {

                            user.login( false, {
                                success: function( model ) {
                                    window.location = "/dashboard.html";
                                },
                                error: function( model, response ) {
                                    $( "#result" ).html( "<b>Unable to login.</b>" );
                                    $( "#error").show();
                                    setTimeout( "$( '#error').hide();", 2000 );
                                }
                            } );
                        },
                        error: function( model, response ) {
                            $( "#result" ).html( "<b>Unable to create therapist object.</b>" );
                            $( "#error").show();
                            setTimeout( "$( '#error').hide();", 2000 );
                        }
                    });
                },
                error: function( model, response ) {
                    $( "#result" ).html( "<b>Unable to ammend ACL.</b>" );
                    $( "#error").show();
                    setTimeout( "$( '#error').hide();", 2000 );
                }
            });
		}, 
		error: function( model, response ) {
            $( "#result" ).html( "<b>Unable to create user object.</b>" );
            $( "#error").show();
            setTimeout( "$( '#error').hide();", 2000 );
		}
	} );

}



