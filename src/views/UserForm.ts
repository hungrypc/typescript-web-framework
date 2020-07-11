import { User, UserProps } from '../models/User'
import { View } from '../views/View'

export class UserForm extends View<User, UserProps> {
  
  eventsMap(): { [key: string]: () => void } {
    return {
      // 'click:button': this.onButtonClick, 
      'click:.set-age': this.onSetAgeClick,
      'click:.set-name': this.onSetNameClick,
      'click:.save-model': this.onSaveClick
    }
  }

  onSaveClick = (): void => {
    this.model.save()
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
        <input placeholder="${this.model.get('name')}"/>
        <button class="set-name">Submit Name</button>
        <button class="set-age">Set Random Age</button>
        <button class="save-model">Save</button>
      </div>
    `
  }
}