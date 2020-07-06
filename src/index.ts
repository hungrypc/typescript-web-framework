import { UserForm } from './views/UserForm'
import { User } from './models/User'

const user = User.buildUser({ name: 'NAME', age: 20 })

const userForm = new UserForm(
  document.getElementById('root'),
  user
)

userForm.render()



// import { User } from './models/User'

// const collection = User.buildUserCollection()

// collection.on('change', () => {
//   console.log(collection)
// })

// collection.fetch()


// import { User } from './models/User'

// const user = User.buildUser({id: 1})

// user.on('change', () => {
//   console.log(user)
// })

// user.fetch()

// const user = new User({ id: 1, name: 'newer name', age: 0 })

// // console.log(user.get('name'))

// user.on('save', () => {
//   console.log('saved', user)
// })

// user.save()


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