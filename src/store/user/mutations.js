


export default {
    refushUser: function (state, newValue) {
        state.userDetails = newValue;
    },
    refushUserPhoto: function (state, newValue) {
        state.userDetails.photo = newValue;
    },
    clearUser(state) {
        state.userDetails = null
    },

}