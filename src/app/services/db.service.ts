import { Injectable } from '@angular/core'
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

import { IRegistration, ILog } from 'src/app/interfaces/db.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})

export class DBService {
  private supaBase: SupabaseClient

  constructor() {
    this.supaBase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  async getAll(table: string) {
    return await this.supaBase.from(table).select()
  }

  async upsert(table: string, data: IRegistration | ILog) {
    return await this.supaBase.from(table).upsert(data)
  }

  async checkIfClaimed(id: number, kidIndex: number, kioskIndex: number) {
    const res = await this.supaBase.from('logs').select().eq('regNo', id).eq('kidIndex', kidIndex).eq('kioskIndex', kioskIndex)
    return res.data && res.data.length > 0
  }

  async checkIfExists(email: string) {
    const res = await this.supaBase.from('registrations').select().eq('email', email)
    return res.data && res.data.length > 0
  }

  async findById(table: string, id: number) {
    return await this.supaBase.from(table).select().eq('id', id)
  }

  subscribe(table: string, event: any) {
    return new Observable(_ => {
      this.supaBase.channel(table)
        .on(
          'postgres_changes',
          { event, schema: 'public' },
          (payload) => {
            _.next(payload.new)
          }
        ).subscribe()
    })
  }
}
