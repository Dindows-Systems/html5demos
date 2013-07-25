function list_patients() {
     //console.log("list patients");
    /**
     * Get therapist_id.
     */
    therapist = StackMob.Model.extend({
        schemaName: 'therapist'
    });

    var therapists = new therapist();

    var q = new StackMob.Collection.Query();
    q.equals('username', StackMob.getLoggedInUser());
    therapists.query(q, {
        success: function(collection) {

            if( typeof( collection["attributes"][0] ) == "object" ) {

                patient = StackMob.Model.extend({
                    schemaName: 'patient'
                });

                var patients = new patient();

                var q = new StackMob.Collection.Query();
                q.equals('therapist_id', collection["attributes"][0]["therapist_id"]);

                patients.query(q, {
                    success: function(collection) {

                        $( "#content" ).empty();

                        $("#content").append('<h1>Patients</h1><select onchange="$(\'#area\').empty();" class="span6" id="patients"></select>');

                        var count = 0;

                        $.each(collection.toJSON(), function(key, value) {
                         count++;
                            if (typeof(value)=="object" &&  value["username"]) {

                                pat = new StackMob.User({ username: value["username"] });
                                pat.fetch({
                                    success: function(model) {
                                        $("#content #patients").append('<option value="' + value["username"] + '">' + model["attributes"]["displayname"] + '</option>')
                                    },
                                    error: function(model,response) {
                                       console.log("Patient retrieval failed.");
                                    }
                                });
                            }

                        });

                        var disabled = ( count == 0 ) ? " disabled" : "";

                        $("#content").append('<div class="btn-group">\
                                                        <a class="btn dropdown-toggle" data-toggle="dropdown' + disabled + '" href="#">\
                                                            Scheduled Programs\
                                                            <span class="caret"></span>\
                                                         </a>\
                                                        <ul class="dropdown-menu">\
                                                            <li><a href="#" onclick="create_scheduledprogram(\'#area\');">Create</a></li>\
                                                            <li><a href="#" onclick="modify_scheduledprogram(\'#area\');">Modify Days</a></li>\
                                                            <li><a href="#" onclick="remove_scheduledprogram(\'#area\');">Remove</a></li>\
                                                        </ul>\
                                                        <button class="btn' + disabled + '" onclick="remove_patient_t();">Remove</button>\
                                                        <button class="btn' + disabled + '" onclick="patient_profile();">Profile</button>\
                                                        <button class="btn' + disabled + '" onclick="patient_progress_t();">Progress</button>\
                                                    </div>\
                                                    <script>\
                                                    function patient_profile() {\
                                                        profile($("#content option:selected").val(), "#area");\
                                                    }\
                                                    function remove_patient_t() {\
                                                        remove_patient($("#content option:selected").val());\
                                                    }\
                                                    function patient_progress_t() {\
                                                        patient_progress($("#content option:selected").val(), "#area");\
                                                    }\
                                                    </script>\
                                                    <br><div id="area"></div>');


                    },
                    error: function( collection, response ) {
                        console.log("Unable to retrieve patients.");
                    }

                });



            }
            else {
                console.log("No matching therapist.");

            }
        },
        error: function( model, response ) {
            console.log("Unable to query therapist table.");
        }
    });

}





