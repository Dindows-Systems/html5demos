function logout() {
    var user = new StackMob.User({ username: StackMob.getLoggedInUser()});
    user.logout();
}
