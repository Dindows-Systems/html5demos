function delete_therapist() {

    therapist = StackMob.Model.extend({
        schemaName: "therapist"
    });

    var _therapist = new therapist();

    var query = new StackMob.Collection.Query();

    query.equals( "username", StackMob.getLoggedInUser() );

    _therapist.query( query, {
        success: function( collection ) {

            var therapist_id = collection[ "attributes" ][ 0 ];

            if( therapist_id != undefined ) {

                therapist_id = therapist_id[ "therapist_id" ];

                var _therapist = new therapist({
                    therapist_id: therapist_id
                });

                _therapist.destroy();

                aclrole = StackMob.Model.extend({
                    schemaName: 'aclrole'
                });

                var entries = new aclrole({
                    aclrole_id: "therapists"
                });

                entries.deleteAndSave( 'members', [ StackMob.getLoggedInUser() ], StackMob.SOFT_DELETE, {
                    success: function(model) {

                        var user = new StackMob.User({
                            username: StackMob.getLoggedInUser()
                        });

                        user.destroy();

                        user.logout();

                    },
                    error: function( model, response ) {
                        console.log( "Failed to update ACLRole table: " + response );
                    }
                })

            }
            else {
                console.log( StackMob.getLoggedInUser() + " is not a therapist." );
            }
        } ,
        error: function( collection, response) {
            console.log( "Unable to query Therapist table: " + response );
        }
    });

}



