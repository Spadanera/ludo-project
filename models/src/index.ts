import { RowDataPacket } from "mysql2"

export interface Type {
  name: string
  type: string
}

export const ItemTypes:Type[] = [
  {
    name: "Analcolico",
    type: "Bevanda"
  },
  {
    name: "Cocktail",
    type: "Bevanda"
  },
  {
    name: "Birra",
    type: "Bevanda"
  },
  {
    name: "Extra",
    type: "Bevanda"
  },
  {
    name: "Piadina",
    type: "Cibo"
  },
  {
    name: "Panino",
    type: "Cibo"
  },
  {
    name: "Special",
    type: "Cibo"
  }
]

export const Destinations: Destination[] = [
  {
    id: 1,
    name: "Bar Ludoteca",
    location: 'sotto'
  } as Destination,
  {
    id: 2,
    name: "Cucina Ludoteca",
    location: 'sotto'
  } as Destination,
  {
    id: 3,
    name: "Cucina Libra",
    location: 'sopra'
  } as Destination
]

export interface CompleteOrderInput {
  event_id: number,
  table_id: number,
  item_ids: number[]
}


export enum Roles {
  Admin,
  Checkout,
  Waiter,
  Bertender,
  Cook
}

export interface Message {
  room: string
  event: string
  body: any
}

export interface Repository extends RowDataPacket {

}

export interface Audit extends Repository {
  id?: number,
  user_id?: number,
  event_id?: number,
  table_id?: number,
  action?: string,
  actionData?: any
  actionDateTime?: Date
}

export interface Event extends Repository {
  id?: number
  name?: string
  date?: Date
  tables?: Table[]
  workers?: User[]
  orders?: Order[]
  tableCount?: number
  foodCount?: number
  beverageCount?: number
  revenue?: number
}

export interface Table extends Repository {
  id?: number
  event_id?: number
  master_table_id?: number[]
  name?: string
  paid?: boolean
  status?: string
}

export interface AvailableTable extends Repository {
  table_id?: number
  table_name?: string
  master_table_id?: number
  master_table_name?: string
  default_seats?: number
  event_id?: number
}

export interface Order extends Repository {
  id?: number
  event_id?: number
  table_id?: number
  table_name?: string
  master_table_id?: number
  done?: boolean
  items?: Item[]
  itemsToDo?: Item[]
  itemsDone?: Item[]
}

export interface Item extends Repository {
  id?: number
  table_id?: number
  order_id?: number
  master_item_id?: number
  note?: string
  done?: boolean
  paid?: boolean
}

export interface MasterTable extends Repository {
  id?: number
  name?: string
  default_seats?: number
  status?: string
}

export interface User extends Repository {
  id?: number
  username?: string
  email?: string
  password?: string
  roles?: Roles[]
}

export interface Role extends Repository {
  id?: number
  name?: Roles
}

export interface MasterItem extends Repository {
  id?: number
  name?: string
  type?: string
  sub_type?: string
  price?: number
  destination_id?: number
  destination?: string
  available?: boolean
  status?: string
}

export interface Destination extends Repository {
  id?: number
  name?: string
  location?: string
}