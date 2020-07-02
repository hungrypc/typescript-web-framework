# TS Web Framework Notes

```cli
sudo npm i -g parcel-bundler
parcel index.html
```

## General Idea
Within our framework, we'll have two classes:
1. Model Classes
  - handle data, used to represent Users, Blog Posts, Images, etc
2. View Classes
  - Handle HTML and events caused by the user

User class
- private data: UserProps
- get(propName: string): (string | number)
- set(update: UserProps): void
- on(eventName: string, callback: () => {})
- trigger(eventName: string): void
- fetch(): Promise
- save(): Promise


Using json-server
```cli
json-server -w db.json
```

## Composition

### 3 Methods to integrating Eventing class to User class
1. Accept dependencies as a second constructor argument
```ts
export class User {
  constructor(
    private data: UserProps,
    private events: Eventing
  ) {}
  // ...
}

new User({name: "sdflsda"}, new Eventing())
```
However, it's cumbersome to constantly instantiate Eventing when instantiating a new User

2. Only accept dependencies into constructor, define static class method to preconfigure User and assign properties afterwards
```ts
export class User {
  static fromData(data: UserProps): User {
    const user = new User(new Eventing())
    user.set(data)
    return user
  }

  private data: UserProps
  
  constructor(
    private events: Eventing
  ) {}
  // ...
}
```

3. Only accept properties into constructor, hardcode dependencies as class properties
```ts
export class User {
  events: Eventing = new Eventing()

  constructor(
    private data: UserProps
  ) {}
  // ...
}

new User({name: "sdflsda"})
```

### 3 Methods to integrating Sync class to User class
1. Sync gets function arguments
```ts
export class Sync {
  save(id: number, data: UserProps): void {
    // ...
  }

  fetch(id: number): UserProps {
    // ...
  }
}
```
However, Sync will now only work with User. We want this to be reusable for whatever else we make.

2. Sync expects arguments that satisfies interfaces 'Serialize' and 'Deserialize'
```ts
interface Serializable {
  serialize(): {}
  // convert data from an object into some saveable format (json)
}

interface Deserializable {
  deserialize(json: {}): void
  // put data on an object using some previously saved data (json)
}

export class Sync {
  save(id: number, serialize: Serializable): void {
    // ...
  }

  fetch(id: number, deserial: Deserializable): void {
    // ...
  }
}
```
Now with this, `serialize(): {}` allows us that flexibility we didn't have with the previous method.
However, we can't specifically say what properties are going to be on there. That means we lose out on type safety. 

3. Sync is a generic class to customize the type of 'data' coming into save()
```ts
export class Sync<T> {
  save(id: number, data: T): AxiosPromise<T> {
    // ...
  }

  fetch(id: number): AxiosPromise<T> {
    // ...
  }
}
```


## Two Things to Understand
1. In TS, strings can be types
2. In JS (and therefore TS), all object keys are strings


## Composition is Delagation
Because we've composed the User class out of 3 other classes, it can get cumbersome to access methods when they all depend on data that is accessed separately. To solve this, we'll implement some methods in the User class so that we can have all that needs to be done within the class rather than setting up on class calls.

This is going to require:
- direct passthrough of arguments
- coordination between different modules within User

a quick reminder on accessors:
```ts
class Person {
  constructor(
    public firstName: string, 
    public lastName: string
  ) {}

  fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

const person = new Person('firstname', 'lastname')
console.log(person.fullName())    // firstname lastname

// we can set this up as a getter instead

class Person {
  constructor(
    public firstName: string, 
    public lastName: string
  ) {}

  // using get
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

console.log(person.fullName)
```

So with this, we can implement getters by assigning module functions to the getter (passthrough methods).

```ts
export class User {
  public events: Eventing = new Eventing()
  public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl)
  public attributes: Attributes<UserProps>
  
  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs)
  }

  // getting a reference to the on method on Eventing class
  get on() {
    return this.events.on
  }
}

user.on('change', () => {
  console.log('user was changed')
})
```

## Reminder on how 'this' works in JS
Now that we've set up our passthrough methods, we run into another problem. Our 'this' in module methods aren't referencing itself, they're referencing the User class. That's not what we want. To solve this, we turn all module methods into arrow functions.