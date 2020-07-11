import { UserEdit } from './views/UserEdit'
import { User, UserProps } from './models/User'
import { UserList } from './views/UserList'
import { Collection } from './models/Collection'

// build, append, render User & UserEdit
const user = User.buildUser({ name: 'NAME', age: 20 })

const userEdit = new UserEdit(
  document.getElementById('root') as HTMLElement,
  user
)

userEdit.render()
console.log(userEdit)




// fetch, build users, render
const users = new Collection('http://localhost:3000/users', (json: UserProps) => {
  return User.buildUser(json)
})

// render
users.on('change', () => {
  const root = document.getElementById('root')

  if (root) {
    new UserList(root, users).render()
  }
})

// trigger
users.fetch()


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