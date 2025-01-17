export interface RemoteContact {
  id: number,
  name: string,
  username: string,
  email: string,
  address: {
    street: "Kulas Light",
    suite: string,
    city: string,
    zipcode: string,
    geo: {
      lat: string,
      lng: string
    }
  },
  phone: string,
  website: string,
  company: {
    name: string,
    catchPhrase: string,
    bs: string
  },
  image_url?: string
}

export interface Contact {
  id: number,
  name: string,
  username: string,
  email: string,
  address: {
    street: string,
    city: string,
    zipcode?: string,
  },
  company: {
    name?: string,
  },
  image_url: string,
  isLocalContact?: boolean
}