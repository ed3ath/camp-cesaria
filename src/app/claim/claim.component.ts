import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DBService } from 'src/app/services/db.service';
import { ILog } from '../interfaces/db.interface';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {
  enableScanner = false
  checking = false
  selected = ''
  selectedIndex!: number
  showLoader = false

  kiosks = [
    {
      "id": "taters",
      "name": "Taters",
      "product": "Popcorn"
    },
    {
      "id": "kegg",
      "name": "K-Egg Kidapawan",
      "product": "Egg Sandwich"
    },
    {
      "id": "cove",
      "name": "Rabbit Cove",
      "product": "Rabbit Presentation"
    }
  ];

  constructor(public dbService: DBService) { }

  ngOnInit(): void {
  }

  handleQrCodeResult(result: string) {
    if (!this.checking && this.isValidQR(result)) {
      this.checking = true
      this.enableScanner = false
      this.showLoader = true
      const regInfo = JSON.parse(result)
      this.dbService.getById('registrations', regInfo.id).then((res: any) => {
        if (res.data.length > 0) {
          this.dbService.checkIfClaimed(regInfo.id, regInfo.kidIndex, this.selectedIndex).then(async (claimed) => {
            if (!claimed) {
              this.dbService.getNextId('logs').then(nextId => {
                this.dbService.insert('logs', { id: nextId, regNo: regInfo.id, kidIndex: regInfo.kidIndex, kioskIndex: this.selectedIndex } as ILog).then((res2: any) => {
                  this.showLoader = false
                  Swal.fire(
                    '',
                    res2.error ? res2.error : 'Claim was successful',
                    res2.error ? 'error' : 'success'
                  ).then(() => {
                    this.enableScanner = true
                    this.checking = false
                  })
                })
              })
            } else {
              this.showLoader = false
              Swal.fire(
                '',
                'Already claimed for this kiosk',
                'error'
              ).then(() => {
                this.enableScanner = true
                this.checking = false
              })
            }
          })

        } else {
          this.showLoader = false
          Swal.fire(
            '',
            'Invalid QR Code',
            'error'
          ).then(() => {
            this.enableScanner = true
            this.checking = false
          })
        }
      })
    }
  }

  onChange() {
    if (this.selected !== '') {
      this.enableScanner = true
      this.selectedIndex = this.kiosks.findIndex((i: any) => i.id === this.selected)
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
