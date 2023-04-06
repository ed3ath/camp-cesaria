import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

import { DBService } from 'src/app/services/db.service';
import { EventService } from 'src/app/services/event.service';

import { IRegistration } from 'src/app/interfaces/db.interface';

import { QrcodeComponent } from 'src/app/qrcode/qrcode.component';

const CHECK_ICON = `<?xml version="1.0" ?><svg height="15px" version="1.1" viewBox="0 0 18 15" width="18px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#000000" id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape"/></g></g></g></svg>`
const CLOSE_ICON = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>`;
const QR_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="System / Qr_Code"> <path id="Vector" d="M19 20H20M16 20H14V17M17 17H20V14H19M14 14H16M4 16.9997C4 16.0679 4 15.6019 4.15224 15.2344C4.35523 14.7443 4.74432 14.3552 5.23438 14.1522C5.60192 14 6.06786 14 6.99974 14C7.93163 14 8.39808 14 8.76562 14.1522C9.25568 14.3552 9.64467 14.7443 9.84766 15.2344C9.9999 15.6019 9.9999 16.0681 9.9999 17C9.9999 17.9319 9.9999 18.3978 9.84766 18.7654C9.64467 19.2554 9.25568 19.6447 8.76562 19.8477C8.39808 19.9999 7.93162 19.9999 6.99974 19.9999C6.06786 19.9999 5.60192 19.9999 5.23438 19.8477C4.74432 19.6447 4.35523 19.2557 4.15224 18.7656C4 18.3981 4 17.9316 4 16.9997ZM14 6.99974C14 6.06786 14 5.60192 14.1522 5.23438C14.3552 4.74432 14.7443 4.35523 15.2344 4.15224C15.6019 4 16.0679 4 16.9997 4C17.9316 4 18.3981 4 18.7656 4.15224C19.2557 4.35523 19.6447 4.74432 19.8477 5.23438C19.9999 5.60192 19.9999 6.06812 19.9999 7C19.9999 7.93188 19.9999 8.39783 19.8477 8.76537C19.6447 9.25542 19.2557 9.64467 18.7656 9.84766C18.3981 9.9999 17.9316 9.9999 16.9997 9.9999C16.0679 9.9999 15.6019 9.9999 15.2344 9.84766C14.7443 9.64467 14.3552 9.25568 14.1522 8.76562C14 8.39808 14 7.93163 14 6.99974ZM4 6.99974C4 6.06786 4 5.60192 4.15224 5.23438C4.35523 4.74432 4.74432 4.35523 5.23438 4.15224C5.60192 4 6.06786 4 6.99974 4C7.93163 4 8.39808 4 8.76562 4.15224C9.25568 4.35523 9.64467 4.74432 9.84766 5.23438C9.9999 5.60192 9.9999 6.06812 9.9999 7C9.9999 7.93188 9.9999 8.39783 9.84766 8.76537C9.64467 9.25542 9.25568 9.64467 8.76562 9.84766C8.39808 9.9999 7.93162 9.9999 6.99974 9.9999C6.06786 9.9999 5.60192 9.9999 5.23438 9.84766C4.74432 9.64467 4.35523 9.25568 4.15224 8.76562C4 8.39808 4 7.93163 4 6.99974Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >	<path d="M 82.127 71.258 H 26.728 c -4.341 0 -7.873 -3.532 -7.873 -7.873 v -10.16 c 0 -0.828 0.671 -1.5 1.5 -1.5 s 1.5 0.672 1.5 1.5 v 10.16 c 0 2.687 2.186 4.873 4.873 4.873 h 55.399 c 2.687 0 4.873 -2.187 4.873 -4.873 v -36.77 c 0 -2.687 -2.187 -4.873 -4.873 -4.873 H 26.728 c -2.687 0 -4.873 2.186 -4.873 4.873 v 10.038 c 0 0.829 -0.671 1.5 -1.5 1.5 s -1.5 -0.671 -1.5 -1.5 V 26.615 c 0 -4.341 3.532 -7.873 7.873 -7.873 h 55.399 c 4.341 0 7.873 3.532 7.873 7.873 v 36.77 C 90 67.726 86.468 71.258 82.127 71.258 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 63.732 45 l 16.726 -15.344 c 0.61 -0.56 0.651 -1.509 0.092 -2.12 c -0.56 -0.61 -1.508 -0.65 -2.119 -0.091 L 54.427 49.466 L 30.425 27.445 c -0.611 -0.559 -1.559 -0.519 -2.12 0.091 c -0.56 0.61 -0.519 1.56 0.091 2.12 L 45.122 45 L 28.396 60.345 c -0.61 0.561 -0.651 1.509 -0.091 2.119 c 0.296 0.323 0.7 0.486 1.106 0.486 c 0.362 0 0.726 -0.131 1.014 -0.395 l 16.916 -15.52 l 6.072 5.571 c 0.286 0.263 0.65 0.395 1.014 0.395 s 0.728 -0.132 1.014 -0.395 l 6.073 -5.571 l 16.917 15.52 c 0.288 0.264 0.651 0.395 1.014 0.395 c 0.405 0 0.81 -0.163 1.105 -0.486 c 0.56 -0.61 0.519 -1.559 -0.092 -2.119 L 63.732 45 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 25.423 46.5 H 7.539 c -0.829 0 -1.5 -0.671 -1.5 -1.5 s 0.671 -1.5 1.5 -1.5 h 17.885 c 0.829 0 1.5 0.671 1.5 1.5 S 26.252 46.5 25.423 46.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 12.497 36.016 H 1.5 c -0.829 0 -1.5 -0.671 -1.5 -1.5 s 0.671 -1.5 1.5 -1.5 h 10.997 c 0.829 0 1.5 0.671 1.5 1.5 S 13.326 36.016 12.497 36.016 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 12.497 56.984 H 4.394 c -0.829 0 -1.5 -0.672 -1.5 -1.5 s 0.671 -1.5 1.5 -1.5 h 8.104 c 0.829 0 1.5 0.672 1.5 1.5 S 13.326 56.984 12.497 56.984 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  file!: File;
  fileName: string = '';
  enableBtn = false;
  observer: any;

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
  registrations: any = [];
  logs: any = [];



  @ViewChild(MatTable) table: MatTable<any> | undefined

  registrationColumns = [
    "id",
    "adults",
    "kids",
    "email",
    "mobile",
    "paid",
    "checkedIn",
    "markPaid",
    "genQR",
    "delRow"
  ];

  logColumns = [
    "id",
    "regNo",
    "kidIndex",
    "kioskIndex",
    "timestamp"
  ]

  constructor(
    public dbService: DBService,
    private eventService: EventService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    iconRegistry.addSvgIconLiteral('check-icon', sanitizer.bypassSecurityTrustHtml(CHECK_ICON));
    iconRegistry.addSvgIconLiteral('close-icon', sanitizer.bypassSecurityTrustHtml(CLOSE_ICON));
    iconRegistry.addSvgIconLiteral('qr-icon', sanitizer.bypassSecurityTrustHtml(QR_ICON));
    iconRegistry.addSvgIconLiteral('email-icon', sanitizer.bypassSecurityTrustHtml(EMAIL_ICON));
  }

  ngOnInit() {
    this.eventService.subscribe('db_connected', () => {
      setTimeout(() => {
        this.dbService.getRef('registrations').observe().subscribe(() => {
          this.loadRegistrations()
        })
        this.dbService.getRef('logs').observe().subscribe(() => {
          this.loadLogs()
        })
      }, 3000)
    })
  }

  loadRegistrations() {
    this.dbService.getAll('registrations').then(res => {
      this.registrations = res?.sort((a: any, b: any) => b.id - a.id)
    })
  }

  loadLogs() {
    this.dbService.getAll('logs').then(res => {
      this.logs = res?.sort((a: any, b: any) => b.id - a.id)
    })
  }

  onFileSelected() {
    const e: any = document.querySelector('#file');
    if (e.files.length > 0) {
      this.file = e.files[0];
      this.fileName = this.file.name;
      this.enableBtn = true
    } else {
      this.enableBtn = false
    }
  }

  displaySplit(data: any) {
    return `<span>${data.join('</span><br><span>')}</span>`;
  }

  getKidName(regNo: number, kidIndex: number) {
    const regInfo = this.registrations.find((i: any) => i.id === regNo)
    return regInfo.kids[kidIndex]
  }

  getIcon(status: boolean) {
    return `${status ? 'check' : 'close'}-icon`;
  }

  getColor(status: boolean) {
    return `color: ${status ? 'green' : 'red'};`
  }

  getKioskName(kioskIndex: number) {
    return this.kiosks[kioskIndex].name;
  }

  markPaid(id: number) {
    this.dbService.update('registrations', id, { ...this.registrations.find((i: IRegistration) => i.id === id), paid: true })
  }

  markUnpaid(id: number) {
    this.dbService.update('registrations', id, { ...this.registrations.find((i: IRegistration) => i.id === id), paid: false })
  }

  add() {
    Swal.fire({
      title: 'Add walk-in',
      html:
        `<label for="adults">Name of the Adult(s)</label><input id="adults" type="text" class="swal2-input" style="width: 80% !important; font-size: 1rem !important;" placeholder="Separated by comma (ex. Juan,Juana)" autocomplete="off">
        <br><br>
        <label for="kids">Name of the Kid(s)</label><input id="kids" type="text" class="swal2-input" style="width: 80% !important; font-size: 1rem !important;" placeholder="Separated by comma (ex. Juan,Juana)" autocomplete="off">
        <br>
        <input id="email" type="email" class="swal2-input" style="width: 80% !important; font-size: 1rem !important;" placeholder="Email" autocomplete="off">
        <br>
        <input id="mobile" type="text" class="swal2-input" style="width: 80% !important; font-size: 1rem !important;" placeholder="Mobile #" autocomplete="off">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('adults')).value,
          (<HTMLInputElement>document.getElementById('kids')).value,
          (<HTMLInputElement>document.getElementById('email')).value,
          (<HTMLInputElement>document.getElementById('mobile')).value
        ]
      }
    }).then(async res => {
      if (res.value && res.isConfirmed) {
        if (res.value[0] && res.value[1] && res.value[2] && res.value[3]) {
          this.dbService.insert('registrations', {
            id: await this.dbService.getNextId('registrations'),
            adults: res.value[0].split(',').map(i => i.trim()),
            kids: res.value[1].split(',').map(i => i.trim()),
            email: res.value[2],
            mobile: res.value[3],
            paid: true,
            checkedIn: true
          }).then(() => {
            Swal.fire(
              '',
              'Walk-in registered successfully',
              'success'
            )
          })
        }
      }
    })
  }

  import() {
    if (this.file && this.file.type === 'text/csv') {
      let fileReader = new FileReader();
      fileReader.onload = async () => {
        const res = fileReader.result
        if (res) {
          for (let row of this.csvJSON(res.toString())) {
            let tmpRow: IRegistration = {
              id: await this.dbService.getNextId('registrations'),
              adults: [] as string[],
              kids: [] as string[],
              email: '',
              mobile: '',
              paid: false,
              checkedIn: false
            };
            Object.keys(row).forEach(col => {
              if (col === 'Email Address') {
                tmpRow.email = row[col];
              }
              if (col === 'Mobile #') {
                tmpRow.mobile = row[col];
              }
              if (col.includes('Adult')) {
                tmpRow.adults.push(row[col]);
              }
              if (col.includes('Kid')) {
                tmpRow.kids.push(row[col]);
              }
            })
            if (!await this.dbService.checkIfExists(tmpRow.email)) {
              await this.dbService.insert('registrations', tmpRow)
            }
          }
          Swal.fire(
            '',
            'Data imported successfully',
            'success'
          )
          const e: any = document.querySelector('#file');
          e.value = ""
        }
        this.enableBtn = false;
      }
      fileReader.readAsText(this.file);
    } else {
      Swal.fire(
        '',
        'Invalid file type',
        'error'
      );
      this.enableBtn = false;
    }
  }

  genQR(id: number) {
    this.dialog.open(QrcodeComponent, {
      data: this.registrations.find((i: any) => i.id === id)
    });
  }

  delRow(id: number) {
    this.dbService.delete('registrations', id).then(() => {
      Swal.fire(
        '',
        'Row deleted successfully',
        'success'
      )
    })
  }

  csvJSON(csv: any) {
    var lines = csv.split("\n");
    var result = [];
    var commaRegex = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g
    var quotesRegex = /^"(.*)"$/g
    var headers = lines[0].split(',');
    for (var i = 1; i < lines.length; i++) {
      var obj: any = {};
      var currentline = lines[i].split(commaRegex);
      for (var j = 0; j < headers.length; j++) {
        if (currentline[j].trim()) {
          obj[headers[j].replace("\"", "").trim()] = currentline[j].replace(quotesRegex, "$1").replace("\"", "").trim();
        }
      }
      result.push(obj);
    }
    return result;
  }

  getAdultCount(reg: any) {
    return reg.reduce((a: any, b: any) => a + b.adults.length, 0)
  }

  getKidCount(reg: any) {
    return reg.reduce((a: any, b: any) => a + b.kids.length, 0)
  }

  getTotalRegFee() {
    const adultCount = this.getAdultCount(this.registrations)
    const kidCount = this.getKidCount(this.registrations)
    return ((adultCount * 100) + (kidCount * 500)).toLocaleString('en-US', {
      currency: 'PHP',
      style: 'currency'
    });
  }

  getTotalPaidRegFee() {
    const adultCount = this.getAdultCount(this.registrations.filter((i: any) => i.paid))
    const kidCount = this.getKidCount(this.registrations.filter((i: any) => i.paid))
    return ((adultCount * 100) + (kidCount * 500)).toLocaleString('en-US', {
      currency: 'PHP',
      style: 'currency'
    });
  }

  getTotalUnpaidRegFee() {
    const adultCount = this.getAdultCount(this.registrations.filter((i: any) => !i.paid))
    const kidCount = this.getKidCount(this.registrations.filter((i: any) => !i.paid))
    return ((adultCount * 100) + (kidCount * 500)).toLocaleString('en-US', {
      currency: 'PHP',
      style: 'currency'
    });
  }

}
