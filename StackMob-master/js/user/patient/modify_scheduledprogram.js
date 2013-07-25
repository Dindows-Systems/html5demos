function modify_scheduledprogram( selector ) {
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
                    <select id="scheduledprogram" class="span6" onchange="select_days();"></select>\
                </div>\
            </div>\
            <div class="control-group">\
                <label class="control-label" for="days">Days:</label>\
                <div class="controls">\
                    <select id="days" size="7" class="span6" multiple></select>\
                </div>\
            </div>\
            <div class="control-group">\
                <div class="controls">\
                    <button type="button" class="btn-primary" onclick="update_scheduledprogram();">Update</button>\
                </div>\
            </div>\
        </form>\
        '
    )

    /**
     * Add day information.
     */
    day = StackMob.Model.extend({
        schemaName: 'day'
    });

    var _day = new day();

    var query = new StackMob.Collection.Query();

    query.orderAsc( "order" );

    _day.query( query, {
        success: function( collection ) {
            $.each( collection.toJSON(), function( key, value ) {
                $( selector + " #days" ).append(
                    '<option value="' + value[ 'day_id' ] + '">' +  value[ 'name' ] + '</option>'
                )
            });
        },
        error: function( collection, response ) {
            console.log( "Unable to query Day table: " + response );
        }
    });

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

                                    if( $( "#scheduledprogram" ).length == 1) { select_days(); }

                                    $( "#spin" ).hide();

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

function select_days() {

    $( "#days option" ).attr( "selected", false );

    scheduledprogram_id = $( "#scheduledprogram option:selected" ).val();

    if( scheduledprogram_id != undefined ) {

        scheduledprogram = StackMob.Model.extend({
            schemaName: 'scheduledprogram'
        });

        var _scheduledprogram = new scheduledprogram({
            scheduledprogram_id: scheduledprogram_id
        });

        _scheduledprogram.fetchExpanded(3, {
            success: function( model ) {

                days_id = model[ "attributes" ][ "days_id" ];

                if( days_id != undefined ) {
                    $.each( days_id, function( key, value ) {
                        //console.log(value[ "day_id" ]);
                        $( "#days option[ value='" + value[ "day_id" ] + "' ]" ).prop( "selected", true );
                    });
                }
            },
            error: function( model, response ) {
                console.log( "Unable to fetch from ScheduledProgram table: " + response );
            }
        });

    }
}

function update_scheduledprogram() {

    $( "#spin" ).show();

    //console.log('updating');

    scheduledprogram_id = $( "#scheduledprogram option:selected" ).val();

    days_id = [];

    $( "#days option:selected" ).each(
        function () {
            days_id.push( $( this ).val() );
        }
    );

    /**
     * Add scheduledprogram row.
     */
    scheduledprogram = StackMob.Model.extend({
        schemaName: 'scheduledprogram'
    });

    var _scheduledprogram = new scheduledprogram({
        scheduledprogram_id: scheduledprogram_id
    });

    _scheduledprogram.save( { days_id: days_id }, {
        success: function( model ) {
            //console.log("success");
            list_patients( );
            $( "#spin" ).hide();
        },
        error: function( model, response ) {
            console.log( "Unable to update ScheduledProgram table: " + response );
        }
    });

}