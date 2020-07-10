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

## Composition vs Inheritance
Now that we have our methods reimplemented into our User class, we have to talk about some of the problems that we still have.

First big issue: a lot of nested properties (events, sync, attributes) are marked as public. We want other devs to go through the methods we've set up. 

Next: these nested objects are hardcoded object references. The entire point of composition is that we should be able to swap out these different nested properties to create new different functionality. 

Lastly: the type for each of these properties are implementations (classes). Ideally, we want them to be interfaces.

We're trying to create a framework here, we want to create some reusable elements that can be used to create wildly different apps. 

One thing we can do is use inheritance.


## View Classes
To display on html, we're going to have one class UserEdit that will house two other classes: UserShow and UserForm.
- Each view **must** produce HTML
- We should be able to nest one view's HTML in another
- we need to have a good way to handle user events (clicking, typing, etc)
- There will probably be a tight coupling between a view and a model
- We need to be able to reach into the HTML produced by a view and get a specific element

## Rendering Timeline
1. Call 'render' method
2. Render calls 'template', gets HTML string
3. Render inserts HTML string into a template element
4. We should somehow bind event handlers to the HTML in there
5. Render inserts content of template into DOM

You might ask, why not `onClick={clickHandler}`? It's hard to implement. We'd have to create a parser. Instead, we're going to do this:
```ts
export class UserForm {
  constructor(public parent: Element) {}

  eventsMap(): { [key: string]: () => void } {
    return {
      'click:button': this.onButtonClick, 
      // setting a click event handler to onButtonClick
      // more examples: 'hover:h1': this.onHoverHeader,
    }
  }

  onButtonClick(): void {
    console.log('hi')
  }

  template(): string {
    return `
      <div>
        <h1>User Form</h1>
        <input />
        <button>Click Me</button>
      </div>
    `
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap()

    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(':')

      fragment.querySelectorAll(selector) // returns array that matches selector
      .forEach(element => {
        element.addEventListener(eventName, eventsMap[eventKey])
      })
    }
  }

  render(): void {
    const templateElement = document.createElement('template')
    templateElement.innerHTML = this.template()  // turns string into HTML

    this.bindEvents(templateElement.content)
    // this content is a reference to a 'Document Fragment'
    // its purpose is to hold HTML in its memory before it gets attached to the DOM

    this.parent.append(templateElement.content)
  }
}
```


## Binding Events on Class Name
What if we have multiple elements that we want to do different things (like multiple buttons)? Instead of selecting by element, we select based on class name.

There's nothing we really have to change, `querySelectorAll()` actually already selects by the class if you feed it a class.

## Reusable View Logic
Maybe, instead of haviing UserForm render html, we can have an HtmlRenderer class.
However, with the composition approach, there is an issue. The two classes will have a bidirectional relationship, where they reference each other. From this, composition may not be the best idea. Instead, maybe we should use inheritance. 

With inheritance, we could make a class View. We should make it an abstract class (only ever be used to extend another). This would allow us to add some abstract methods to its definition. 

```ts
export abstract class View<T extends Model<K>, K> {
  // ...
}

export class UserForm extends View<User, UserProps> {
  // ...
}
```

This looks nasty as fuck, but we're going through these hoops because now, inside of UserForm, ts understands that `this.model` is going to refer to an instance of a User AND the different properties that User is going to have - it understand that its going to have the set of properties of UserProps.

This means that anywhere inside of our class, we can refer to `this.model` and ts will be aware of what it returns. It knows this because we passed in UserProps.
