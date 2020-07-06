import { User } from '../models/User'

export class UserForm {
  constructor(public parent: Element, public model: User) {
    this.bindModel()
  }

  eventsMap(): { [key: string]: () => void } {
    return {
      // 'click:button': this.onButtonClick, 
      'click:.set-age': this.onSetAgeClick
    }
  }

  bindModel(): void {
    this.model.on('change', () => {
      this.render()
    })
  }

  onSetAgeClick = (): void => {
    this.model.setRandomAge()
    // need to rerender on update
  }

  template(): string {
    return `
      <div>
        <h1>User Form</h1>
        <div>User name: ${this.model.get('name')}</div>
        <div>User age: ${this.model.get('age')}</div>
        <input />
        <button class="set-age">Set Random Age</button>
        <button>Click Me</button>
      </div>
    `
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap()

    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(':')

      fragment.querySelectorAll(selector).forEach(element => {
        element.addEventListener(eventName, eventsMap[eventKey])
      })
    }
  }

  render(): void {
    // empty parent element before appending again
    this.parent.innerHTML = ''

    const templateElement = document.createElement('template')
    templateElement.innerHTML = this.template()  // turns string into HTML

    this.bindEvents(templateElement.content)

    this.parent.append(templateElement.content)
  }
}