import { Injectable } from '@angular/core'
import {
  AceBaseClient
} from 'acebase-client'
import { environment } from 'src/environments/environment'

import { IRegistration, ILog } from 'src/app/interfaces/db.interface'

@Injectable({
  providedIn: 'root',
})

export class DBService {
  private aceBase: AceBaseClient

  constructor() {
    const host = process.env['DB_HOST'] || 'localhost';
    const port = process.env['DB_PORT'] || 5757
    this.aceBase = new AceBaseClient({ host, port: +port, dbname: 'camp_cesaria', https: environment.production ? true : false })
    this.aceBase.ready(() => {
      console.log('Connected to DB server');
    });
  }

  getQuery(table: string) {
    return this.aceBase.query(table)
  }

  getRef(table: string) {
    return this.aceBase.ref(table)
  }

  async getNextId(table: string) {
    return (await this.getQuery(table).count()) + 1
  }

  async getAll(table: string) {
    return (await this.getQuery(table).get()).getValues()
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
    const rows = (await this.getRef(table).get()).val() || []
    return rows.find((i: any) => i.id === id)
  }
}
