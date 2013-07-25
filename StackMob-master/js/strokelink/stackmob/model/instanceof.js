/**
 * Depends on stackmob when wrapped in requirejs.
 */


/**
 * MAKE THIS FUNCTION PRIVATE eventually.
 *
 * name = entity name from stackmob we want.
 * attributes = properties to select a row from etntity or prepoulate data.
 */

Namespace( 'strokelink.stackmob.model', {
    instanceof: function( name, attributes ) {
        var entity = eval(
            name + ' = StackMob.Model.extend({\
                schemaName: "' + name + '"\
            });'
        );
        return new entity( attributes );
    }
});
