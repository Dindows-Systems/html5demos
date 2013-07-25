media = StackMob.Model.extend({
    schemaName: 'media'
});

var files = new media({
//    filename: 'milan'
});

/*

file.create({
    success: function(model) {
        alert( 'file created' );
    },
    error: function(model, response) {
        alert( 'failed.' );
    }
});
*/

files.fetch({
    success: function( model ) {
         $( '#viewer' ).val( model.toJSON() );
        console.debug(model.toJSON());
    },
    error: function( model, response ) {
        $( '#viewer').val( 'nothing' );
    }
});