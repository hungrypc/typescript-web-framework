import { User } from '../models/User'
import { View } from '../views/View'

export class UserForm extends View {
  
  eventsMap(): { [key: string]: () => void } {
    return {
      // 'click:button': this.onButtonClick, 
      'click:.set-age': this.onSetAgeClick,
      'click:.set-name': this.onSetNameClick
    }
  }

  onSetAgeClick = (): void => {
    this.model.setRandomAge()
  }

  onSetNameClick = (): void => {
    const input = this.parent.querySelector('input') as HTMLInputElement
    const name = input.value
    this.model.set({ name })
  }

  template(): string {
    return `
      <div>
        <h1>User Form</h1>
        <div>User name: ${this.model.get('name')}</div>
        <div>User age: ${this.model.get('age')}</div>
        <input />
        <button class="set-name">Submit Name</button>
        <button class="set-age">Set Random Age</button>
      </div>
    `
  }

  
}