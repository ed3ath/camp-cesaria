import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  enableScanner = false
  checking = false
  showLoader = false

  constructor(public dbService: DBService) { }

  ngOnInit(): void {
    this.enableScanner = true
  }

  handleQrCodeResult(result: string) {
    if (!this.checking && this.isValidQR(result)) {
      this.showLoader = true
      this.checking = true
      this.enableScanner = false
      const regInfo = JSON.parse(result)
      this.dbService.getById('registrations', regInfo.id).then((res: any) => {
        if (!res.data[0].checkedIn) {
          this.dbService.update('registrations', regInfo.id, { ...res.data[0], checkedIn: true }).then((res2: any) => {
            this.showLoader = false
            Swal.fire(
              '',
              res2.error ? 'An error occurred, try again.' : 'Check-in was successful',
              res2.error ? 'error' : 'success'
            ).then(() => {
              this.enableScanner = true
              this.checking = false
            })
          })
        } else {
          this.showLoader = false
          Swal.fire(
            '',
            'Already checked-in',
            'error'
          ).then(() => {
            this.enableScanner = true
            this.checking = false
          })
        }
      })
    }
  }

  isValidQR(text: string) {
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      return true
    } else {
      return false
    }
  }

}
