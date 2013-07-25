function remove_scheduledprogram( selector ) {
    $( "#spin" ).show();
    /**
     * Add form mark-up.
     */
    $( selector ).empty();
    $( selector ).append(
        '\
        <form>\
            <div class="control-group">\
                <label class="control-label" for="scheduledprogram">Scheduled Program:</label>\
                <div class="controls">\
                    <select id="scheduledprogram" class="span6"></select>\
                </div>\
            </div>\
            <div class="control-group">\
                <div class="controls">\
                    <button type="button" class="btn-primary" onclick="delete_scheduledprogram();">Delete</button>\
                </div>\
            </div>\
        </form>\
        '
    )

    /**
     * Get patient_id.
     */
    patient = StackMob.Model.extend({
        schemaName: "patient"
    });

    var _patient = new patient();

    var query = new StackMob.Collection.Query();

    query.equals( "username", $( "#patients option:selected" ).val() );

    _patient.query( query, {
        success: function( collection ) {

            patient_id = collection[ "attributes" ][ 0 ][ "patient_id" ];

            /**
             * Get related scheduledprogram rows.
             */
            scheduledprogram = StackMob.Model.extend({
                schemaName: 'scheduledprogram'
            });

            var _scheduledprogram = new scheduledprogram();

            var query = new StackMob.Collection.Query();

            query.equals( "patient_id", patient_id );

            _scheduledprogram.query( query, {
                success: function( collection ) {

                    program = StackMob.Model.extend({
                        schemaName: "program"
                    });

                    $.each( collection.toJSON(), function( key, value ) {

                        program_id = value[ "program_id" ];

                        if( program_id != undefined ) {

                            var _program = new program({
                                program_id: program_id,
                                scheduleprogram_id: value[ 'scheduledprogram_id' ]
                            });

                            _program.fetch({
                                success: function( model ) {

                                    name = ( "name" in model[ "attributes" ] ) ? model[ "attributes" ][ "name" ] : "Unnamed Program";
                                    $( selector + " #scheduledprogram" ).append(
                                        '<option value="' + model[ "attributes" ][ "scheduleprogram_id" ] + '">' + name + '</option>'
                                    )

                                    if( $( "#scheduledprogram" ).length == 1) { select_days(); $( "#spin" ).hide(); }

                                },
                                error: function( model, response ) {
                                    console.log( "Unable to fetch from ScheduledProgram table: " + response );
                                }
                            });

                        }

                    });
                },
                error: function( collection, response ) {
                    console.log( "Unable to query ScheduledProgram table: " + response[ "error" ] );
                }
            });
        },
        error: function( collection, response ) {
            console.log( "Unable to query Patient table: " + response );
        }
    });
}

function delete_scheduledprogram() {
    $( "#spin" ).show();
    //console.log('deleting');

    scheduledprogram_id = $( "#scheduledprogram option:selected" ).val();

    /**
     * Add scheduledprogram row.
     */
    scheduledprogram = StackMob.Model.extend({
        schemaName: 'scheduledprogram'
    });

    var _scheduledprogram = new scheduledprogram({
        scheduledprogram_id: scheduledprogram_id
    });

    _scheduledprogram.destroy({
        success: function( model ) {
            $( "#spin" ).hide();
            //console.log("success");
            list_patients( );
        },
        error: function( model, response ) {
            console.log( "Unable to update ScheduledProgram table: " + response );
        }
    });

}