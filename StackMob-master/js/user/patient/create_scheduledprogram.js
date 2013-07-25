function create_scheduledprogram( selector ) {
    $( "#spin" ).show();
    /**
     * Add form mark-up.
     */
    $( selector ).empty();
    $( selector ).append(
        '\
        <form>\
            <div class="control-group">\
                <label class="control-label" for="program">Program:</label>\
                <div class="controls">\
                    <select id="program" class="span6"></select>\
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
                    <button type="button" class="btn-primary" onclick="add_scheduledprogram();">Add</button>\
                </div>\
            </div>\
        </form>\
        '
    )

    /**
     * Add program information.
     */
    program = StackMob.Model.extend({
        schemaName: 'program'
    });

    var _program = new program();

    var query = new StackMob.Collection.Query();

    query.orderAsc( "name" );

    _program.query( query, {
        success: function( collection ) {
            $.each( collection.toJSON(), function( key, value ) {

                name = ( "name" in value ) ? value[ "name" ] : "Unnamed Program";

                $( selector + " #program" ).append(
                    '<option value="' + value[ 'program_id' ] + '">' +  name + '</option>'
                )
            });

        },
        error: function( collection, response ) {
            console.log( "Unable to query Program table: " + response );
        }
    });

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
            $( "#spin" ).hide();
        },
        error: function( collection, response ) {
            console.log( "Unable to query Day table: " + response );
        }
    });
}

function add_scheduledprogram() {

    $( "#spin" ).show();

    program_id = $( "#program option:selected" ).val();

    days_id = [];

    $( "#days option:selected" ).each(
        function () {
            days_id.push( $( this ).val() );
        }
    );

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

            patient_id = collection[ "attributes" ][ 0 ] ["patient_id" ];

            /**
             * Add scheduledprogram row.
             */
            scheduledprogram = StackMob.Model.extend({
                schemaName: 'scheduledprogram'
            });

            var _scheduledprogram = new scheduledprogram({
                program_id: program_id,
                days_id: days_id,
                patient_id: patient_id
            });

            _scheduledprogram.create({
                success: function( model ) {
                    list_patients(  );
                    $( "#spin" ).hide();
                },
                error: function( model, response ) {
                    console.log( "Unable to update ScheduledProgram table: " + response );
                }
            });
        },
        error: function( collection, response ) {
            console.log( "Unable to query Patient table: " + response );
        }
    });

}