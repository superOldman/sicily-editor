


export default {
	refushUserFun(context) {
		context.commit('refushUser')
	},
	refushUserPhotoFun(context, val) {
		context.commit('refushUserPhoto', val)
	},
	refushUserMottoFun(context, val) {
		context.commit('refushUserMotto', val)
	}
}