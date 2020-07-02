// import axios from 'axios'
import { User } from './models/User'

const user = new User({ id: 1 })

console.log(user.get('name'))

user.on('change', () => {
  console.log('changed', user)
})

user.fetch()


// const user = new User({ name: 'new record', age: 0 })

// user.set({ name: 'newname'})

// console.log(user.get('name'))

// user.events.on('change', () => {
//   console.log('change!')
// })

// user.events.trigger('change')

// user.save()


// axios.post('http://localhost:3000/users', {
//   name: 'myname',
//   age: 26
// })

// axios.get('http://localhost:3000/users/1')




// const user = new User({ name: 'test', age: 26 })

// console.log(user.get('name'), user.get('age'))
// user.set({name: 'updated'})
// console.log(user.get('name'))

// user.on('change', () => {
//   console.log('triggered')
// })
// user.on('change', () => {
//   console.log('triggered2')
// })

// console.log(user)
// user.trigger('change')