function logged_in() {
    if( StackMob.isLoggedIn() ) {
        user = new StackMob.User( {
            username: StackMob.getLoggedInUser()
        } );
    }
}