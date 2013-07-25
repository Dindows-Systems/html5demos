/**
 * Depends on stackmob when wrapped in requirejs.
 */


/**
 * model = entity name.
 * attributes = fields to identify a particular row.
 * operation = query operation to use
 * parameters = hash of parameters to pass to query operation
 * success = callback function.
 * error = callback function.
 */

Namespace( 'strokelink.stackmob.collection', {
    query: function( model, attributes, operation, parameters, success, error ) {
        var object = strokelink.stackmob.model.instanceof( model, attributes );
        var query = new StackMob.Collection.Query();
        eval( 'query.' + operation + '( ' + parameters + ' )' );
        object.query( query, success, error );
    }
});
