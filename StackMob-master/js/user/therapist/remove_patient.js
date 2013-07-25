function remove_patient( username ) {

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

                patient = StackMob.Model.extend({
                    schemaName: 'patient'
                });

                var _patient = new patient();

                query.equals( "username", username );

                _patient.query( query, {
                    success: function( collection ) {

                        var patient_id = collection[ "attributes" ][ 0 ];

                        if( patient_id != undefined ) {

                            patient_id = patient_id[ "patient_id" ];

                            var _patient = new patient({
                                patient_id: patient_id
                            });

                            _patient.deleteAndSave( 'therapist_id', [ therapist_id ], StackMob.SOFT_DELETE, {
                                success: function( model ) {
                                    list_patients();
                                },
                                error: function( model, response ) {
                                    console.log( "Failed to update therapist_id of Patient table: " + response );
                                }
                            })

                        }
                        else {
                            console.log( StackMob.getLoggedInUser() + " is not a patient." );
                        }
                    } ,
                    error: function( collection, response) {
                        console.log( "Unable to query Patient table: " + response );
                    }
                });

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





