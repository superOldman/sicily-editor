


export default {
    refushUser: function (state, newValue) {
        state.userDetails = newValue;
    },
    clearUser(state) {
        state.userDetails = {}
    },

}