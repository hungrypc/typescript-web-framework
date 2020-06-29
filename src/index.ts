import { User } from './models/User'

const user = new User({ name: 'test', age: 26 })

console.log(user.get('name'), user.get('age'))
user.set({name: 'updated'})
console.log(user.get('name'))

user.on('change', () => {
  console.log('triggered')
})
user.on('change', () => {
  console.log('triggered2')
})

console.log(user)
user.trigger('change')