export interface Translation {
  value: string
  language: string
}

export interface TranslatedString {
  translation: Translation[]
}

export interface Operator {
  id: string
  name: TranslatedString
}

export interface System {
  name: TranslatedString
  operator?: Operator
}

export interface VehicleType {
  formFactor: string
  propulsionType: string
}

export interface Vehicle {
  id: string
  lat: number
  lon: number
  system: System
  vehicleType: VehicleType
  isReserved: boolean
  isDisabled: boolean
}

export interface Station {
  id: string
  name: TranslatedString
  lat: number
  lon: number
  system: System
  numBikesAvailable: number
  numDocksAvailable: number
  capacity: number
  isInstalled: boolean
  isRenting: boolean
  isReturning: boolean
  isVirtualStation: boolean
}

export type MapMode = 'vehicles' | 'stations'
