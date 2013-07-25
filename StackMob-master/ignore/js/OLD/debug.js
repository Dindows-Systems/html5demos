function debug() {
    if( StackMob.isLoggedIn() ) {
        $( '#viewer' ).val( user.get( 'username' ) );
    }
}