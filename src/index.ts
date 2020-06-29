import { User } from './models/User'

const user = new User({ name: 'test', age: 26 })

console.log(user.get('name'))
console.log(user.get('age'))
user.set({name: 'updated'})
console.log(user.get('name'))