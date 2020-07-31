export default {
  refushUser(state, newValue) {
    state.userDetails = newValue;
  },
  refushUserPhoto(state, newValue) {
    state.userDetails.photo = newValue;
  },
  refushUserMotto(state, newValue) {
    state.userDetails.motto = newValue;
  },
  clearUser(state) {
    state.userDetails = null;
  },

};