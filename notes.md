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