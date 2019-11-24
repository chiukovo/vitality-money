import { deviceType } from "~/plugins/deviceType"

export default function(context) {
    context.userAgent = process.server ?
        context.req.headers["user-agent"] :
        navigator.userAgent;

    context.deviceType = deviceType(context.userAgent)

    let isMobile = context.app.$cookies.get('isMobile')
    let routeGroup = context.route.name.split('-')

    //check login
    const token = context.app.$cookies.get('token')

    if (context.deviceType.type === "pc") {
    	context.store.commit("setMobile", 0)
    	context.app.$cookies.set('isMobile', 0)

        if (typeof token == 'undefined') {
          context.redirect('/')
        }

    	if (routeGroup[0] == 'mobile') {
    		context.redirect(302, '/')
    	}
    } else {
    	context.store.commit("setMobile", 1)
    	context.app.$cookies.set('isMobile', 1)

        if (typeof token == 'undefined') {
          context.redirect('/mobile')
        }

      if (routeGroup[0] != 'mobile') {
          context.redirect(302, '/mobile')
      }
    }
}