export default function(context) {
  let isMobile = context.app.$cookies.get('isMobile')
  let routeGroup = context.route.name.split('-')

  const token = context.app.$cookies.get('token')

  //pc
  if (!context.isMobile) {
  	context.store.commit("setMobile", 0)
  	context.app.$cookies.set('isMobile', 0)

      if (typeof token == 'undefined') {
        context.redirect(302, '/')
        return
      }

  	if (routeGroup[0] == 'mobile') {
  		context.redirect(302, '/')
      return
  	}
  } else {
  	context.store.commit("setMobile", 1)
  	context.app.$cookies.set('isMobile', 1)

    if (typeof token == 'undefined') {
      context.redirect(302, '/mobile')
      return
    }

    if (routeGroup[0] != 'mobile') {
        context.redirect(302, '/mobile')
        return
    }
  }
}