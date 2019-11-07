export default function({ app, store, redirect }) {
  let token = app.$cookies.get('token')

  if (typeof token == 'undefined') {
    redirect('/')
  }
}