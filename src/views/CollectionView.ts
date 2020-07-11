import { Collection } from '../models/Collection'

export abstract class CollectionView<T, K> {
  constructor(public parent: Element, public collection: Collection<T, K>) {}

  abstract renderItem(model: T, itemParent: Element): void {

  }

  render(): void {
    // clear html
    this.parent.innerHTML = ''

    // will hold the big list of all the different views in HTML
    // will be appended to the DOM
    const templateElement = document.createElement('template')

    for (let model of this.collection.models) {
      // parent element we'll pass into renderItem
      const itemParent = document.createElement('div')
      // result of this should create a view and render some HTML into itemParent 
      this.renderItem(model, itemParent)
      templateElement.content.append(itemParent)
    }

    this.parent.append(templateElement.content)
  }
}