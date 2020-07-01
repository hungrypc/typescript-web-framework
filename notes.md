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