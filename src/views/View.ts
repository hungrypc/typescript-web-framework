import { Model } from '../models/Model'

export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {}

  constructor(public parent: Element, public model: T) {
    this.bindModel()
  }

  abstract template(): string

  regionsMap(): { [key: string]: string } {
    return {}
  }
  
  eventsMap(): { [key: string]: () => void } {
    return {}
  }

  bindModel(): void {
    this.model.on('change', () => {
      this.render()
    })
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

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap()

    for (let region in regionsMap) {
      const selector = regionsMap[region]
      const element = fragment.querySelector(selector) as Element
      if (element) {
        this.regions[region] = element
      }
    }
  }

  render(): void {
    // empty parent element before appending again
    this.parent.innerHTML = ''

    const templateElement = document.createElement('template')
    templateElement.innerHTML = this.template()  // turns string into HTML

    this.bindEvents(templateElement.content)
    this.mapRegions(templateElement.content)

    this.parent.append(templateElement.content)
  }
}