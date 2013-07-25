function patient_progress( username , selector ) {

    //$( "#spin" ).show();
    /**
     * Add form mark-up.
     */
    $( selector ).empty();
    $( selector ).append(
        '\
        <div id="datepicker" style="float:left;">\
        </div>\
        <canvas id="charts" style="float:right; height:250px; width:400px;"></canvas>\
        '
    )

    $( "#datepicker" ).datepicker({
        onSelect: function(dateText, inst) {
            draw_charts( dateText );
        }
    });

    draw_charts(  new Date() );

    /**
     * Get the patient_id.
     * @type {*}
     */
    patient = StackMob.Model.extend({
        schemaName: "patient"
    });

    var _patient = new patient();

    var query = new StackMob.Collection.Query();

    query.equals( "username", username );

    _patient.query( query, {
        success: function( collection ) {

            var patient_id = collection[ "attributes" ][ 0 ];

            if( patient_id != undefined ) {

                /**
                 * Get scheduledprogram_ids.
                 */

                patient_id = patient_id[ "patient_id" ];

                scheduledprogram = StackMob.Model.extend({
                    schemaName: "scheduledprogram"
                });

                var _scheduledprogram = new scheduledprogram();

                var query = new StackMob.Collection.Query();

                query.equals( "patient_id", patient_id );

                _scheduledprogram.query( query, {
                    success: function( collection ) {

                        if( collection[ "attributes" ][0] != undefined ) {

                            /**
                             * Total completed programs / day:
                             * completed_programs[ date ] = total
                             */

                            completed_programs = {};
                            completed_exercises = {};

                            $.each( collection.toJSON(), function( key, value ) {

                                completedprogram = StackMob.Model.extend({
                                    schemaName: "completedprogram"
                                });

                                var _completedprogram = new completedprogram();

                                var query = new StackMob.Collection.Query();

                                query.equals( "scheduledprogram_id", collection[ "attributes" ][ key ][ "scheduledprogram_id" ]);

                                _completedprogram.query( query, {
                                    success: function( collection ) {
                                        /**
                                         * Convert unix timestamp into date.
                                         */

                                        $.each( collection.toJSON(), function( key, value ) {

                                            var _date = new Date( value[ "createddate" ]);

                                            var _date_string =
                                                _date.getFullYear().toString() +
                                                    ( "0" + ( _date.getMonth() + 1 ).toString() ).slice( -2 ) +
                                                        ( "0" + _date.getDate().toString() ).slice( -2 );

                                            if( ! ( ( "a" + _date_string ) in completed_programs ) ) {
                                                eval( "completed_programs.a" + _date_string + " = 1;" )
                                            }
                                            else {
                                                completed_programs[ "a" + _date_string ]++;
                                            }

                                        });

                                    } ,
                                    error: function( collection, response) {
                                        console.log( "Unable to query CompletedProgram table: " + response );
                                    }

                                });

                                /**
                                 *
                                 */

                                completedexercise = StackMob.Model.extend({
                                    schemaName: "completedexercise"
                                });

                                var _completedexercise = new completedexercise();

                                var query = new StackMob.Collection.Query();

                                query.equals( "scheduledprogram_id", collection[ "attributes" ][ key ][ "scheduledprogram_id" ]);

                                _completedexercise.query( query, {
                                    success: function( collection ) {
                                        /**
                                         * Convert unix timestamp into date.
                                         */

                                        $.each( collection.toJSON(), function( key, value ) {

                                            var _date = new Date( value[ "createddate" ]);

                                            var _date_string =
                                                _date.getFullYear().toString() +
                                                    ( "0" + ( _date.getMonth() + 1 ).toString() ).slice( -2 ) +
                                                    ( "0" + _date.getDate().toString() ).slice( -2 );

                                            if( ! ( ( "a" + _date_string ) in completed_exercises ) ) {
                                                eval( "completed_exercises.a" + _date_string + " = 1;" )
                                            }
                                            else {
                                                completed_exercises[ "a" + _date_string ]++;
                                            }

                                        });

                                    } ,
                                    error: function( collection, response) {
                                        console.log( "Unable to query CompletedExercises table: " + response );
                                    }

                                });

                            });


                        }
                        else {
                            $( selector ).empty().append( "<p> User <i>" + username + "</i> has no scheduled programs.</p>" );
                        }
                    },
                    error: function( collection, response) {
                        console.log( "Unable to query ScheduledProgram table: " + response );
                    }
                });

            }
            else {
                console.log( username + " is not a patient." );
            }
        } ,
        error: function( collection, response) {
            console.log( "Unable to query Patient table: " + response );
        }
    });

}

function draw_charts( _date ) {

    var c=document.getElementById("charts");
    var ctx=c.getContext("2d");
    ctx.fillRect(0,0, c.width, c.height);
    ctx.clearRect(0,0,c.width, c.height);

    _date = new Date(_date);

    var line = new RGraph.Line('charts', [4,5,1,6,3,5,2], [4,8,6,5,3,2,5], [12,9,8,6,7,9,11], [4,5,1,2,6,4,3]);

    var date_labels = [];

    var weekday=new Array(7);
    weekday[0]="Sun";
    weekday[1]="M";
    weekday[2]="T";
    weekday[3]="W";
    weekday[4]="Th";
    weekday[5]="F";
    weekday[6]="Sat";

    for (i=0; i<7; i++)
    {

        var _date_string =
            weekday[((_date.getDay() + i) % 7)];
        date_labels.push( _date_string );
    }

    line.Set('chart.noaxes', true);
    line.Set('chart.curvy', false);
    line.Set('chart.linewidth', 1);
    line.Set('chart.hmargin', 5);
    line.Set('chart.labels', date_labels);
    line.Draw();
}