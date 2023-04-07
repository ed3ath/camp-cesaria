import { Injectable } from '@angular/core';
import { AceBase } from 'acebase'

import { IRegistration, ILog } from 'src/app/interfaces/db.interface'

@Injectable({
  providedIn: 'root'
})
export class Db2Service {
  public aceBase: AceBase

  constructor() {
    this.aceBase = AceBase.WithIndexedDB('camp_cesaria');
  }

  getRef(table: string) {
    return this.aceBase.ref(table)
  }

  async getNextId(table: string) {
    return (await this.getRef(table).count()) + 1
  }

  async getAll(table: string) {
    return (await this.getRef(table).get()).val()
  }

  async insert(table: string, data: IRegistration | ILog) {
    const rows = (await this.getRef(table).get()).val() || []
    rows.push(data)
    return await this.getRef(table).set(rows)
  }

  async update(table: string, id: number, data: IRegistration | ILog) {
    const rows = (await this.getRef(table).get()).val() || []
    rows[rows.findIndex((i: any) => i.id === id)] = data
    return await this.getRef(table).set(rows)
  }

  async delete(table: string, id: number) {
    const rows = (await this.getRef(table).get()).val() || []
    rows.splice(rows.findIndex((i: any) => i.id === id), 1)
    return await this.getRef(table).set(rows)
  }

  async checkIfClaimed(id: number, kidIndex: number, kioskIndex: number) {
    const rows = (await this.getRef('logs').get()).val() || []
    return rows.filter((i: any) => i.id === id && i.kidIndex === kidIndex && i.kioskIndex === kioskIndex).length > 0
  }

  async checkIfExists(email: string) {
    const rows = (await this.getRef('registrations').get()).val() || []
    return rows.filter((i: any) => i.email === email).length > 0
  }

  async getById(table: string, id: number) {
    const rows = await this.getAll(table)
    return rows.find((i: any) => i.id === id)
  }
}
