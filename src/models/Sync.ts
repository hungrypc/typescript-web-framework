import axios, { 
  // AxiosResponse, 
  AxiosPromise 
} from 'axios'

interface hasId {
  id?: number
}

export class Sync<T extends hasId> {
  constructor (public rootUrl: string) {}

  fetch = (id: number): AxiosPromise<T> => {
    return axios.get(`${this.rootUrl}/${id}`)
    // .then((res: AxiosResponse): void => {
    //   this.set(res.data)
    // })
  }

  save = (data: T): AxiosPromise<T> => {
    const id = data
    // const id = this.get('id')
    if (id) {      
      return axios.put(`${this.rootUrl}/${id}`, data)
    } else {
      return axios.post(this.rootUrl, data)
    }
  }
}