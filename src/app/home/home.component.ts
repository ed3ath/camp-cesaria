import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { DBService } from 'src/app/services/db.service';
import { DomSanitizer } from '@angular/platform-browser';

import { IRegistration } from '../interfaces/db.interface';

import { QrcodeComponent } from '../qrcode/qrcode.component';

const CHECK_ICON = `<?xml version="1.0" ?><svg height="15px" version="1.1" viewBox="0 0 18 15" width="18px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#000000" id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape"/></g></g></g></svg>`
const CLOSE_ICON = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>`;
const QR_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="System / Qr_Code"> <path id="Vector" d="M19 20H20M16 20H14V17M17 17H20V14H19M14 14H16M4 16.9997C4 16.0679 4 15.6019 4.15224 15.2344C4.35523 14.7443 4.74432 14.3552 5.23438 14.1522C5.60192 14 6.06786 14 6.99974 14C7.93163 14 8.39808 14 8.76562 14.1522C9.25568 14.3552 9.64467 14.7443 9.84766 15.2344C9.9999 15.6019 9.9999 16.0681 9.9999 17C9.9999 17.9319 9.9999 18.3978 9.84766 18.7654C9.64467 19.2554 9.25568 19.6447 8.76562 19.8477C8.39808 19.9999 7.93162 19.9999 6.99974 19.9999C6.06786 19.9999 5.60192 19.9999 5.23438 19.8477C4.74432 19.6447 4.35523 19.2557 4.15224 18.7656C4 18.3981 4 17.9316 4 16.9997ZM14 6.99974C14 6.06786 14 5.60192 14.1522 5.23438C14.3552 4.74432 14.7443 4.35523 15.2344 4.15224C15.6019 4 16.0679 4 16.9997 4C17.9316 4 18.3981 4 18.7656 4.15224C19.2557 4.35523 19.6447 4.74432 19.8477 5.23438C19.9999 5.60192 19.9999 6.06812 19.9999 7C19.9999 7.93188 19.9999 8.39783 19.8477 8.76537C19.6447 9.25542 19.2557 9.64467 18.7656 9.84766C18.3981 9.9999 17.9316 9.9999 16.9997 9.9999C16.0679 9.9999 15.6019 9.9999 15.2344 9.84766C14.7443 9.64467 14.3552 9.25568 14.1522 8.76562C14 8.39808 14 7.93163 14 6.99974ZM4 6.99974C4 6.06786 4 5.60192 4.15224 5.23438C4.35523 4.74432 4.74432 4.35523 5.23438 4.15224C5.60192 4 6.06786 4 6.99974 4C7.93163 4 8.39808 4 8.76562 4.15224C9.25568 4.35523 9.64467 4.74432 9.84766 5.23438C9.9999 5.60192 9.9999 6.06812 9.9999 7C9.9999 7.93188 9.9999 8.39783 9.84766 8.76537C9.64467 9.25542 9.25568 9.64467 8.76562 9.84766C8.39808 9.9999 7.93162 9.9999 6.99974 9.9999C6.06786 9.9999 5.60192 9.9999 5.23438 9.84766C4.74432 9.64467 4.35523 9.25568 4.15224 8.76562C4 8.39808 4 7.93163 4 6.99974Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  file!: File;
  fileName: string = '';
  enableBtn = false

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
    "genQR"
  ];

  logColumns = [
    "id",
    "regNo",
    "kidIndex",
    "kioskIndex",
    "timestamp"
  ]

  constructor(public dbService: DBService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public dialog: MatDialog) {
    iconRegistry.addSvgIconLiteral('check-icon', sanitizer.bypassSecurityTrustHtml(CHECK_ICON));
    iconRegistry.addSvgIconLiteral('close-icon', sanitizer.bypassSecurityTrustHtml(CLOSE_ICON));
    iconRegistry.addSvgIconLiteral('qr-icon', sanitizer.bypassSecurityTrustHtml(QR_ICON));
  }

  ngOnInit() {
    this.loadRegistrations()

    this.dbService.subscribe('*', '*').subscribe(() => {
      this.loadRegistrations()
    });
  }

  loadRegistrations() {
    this.dbService.getAll('registrations').then(res => {
      this.registrations = res.data?.sort((a: any, b: any) => b.id - a.id)
      this.loadLogs()
    })
  }

  loadLogs() {
    this.dbService.getAll('logs').then(res => {
      this.logs = res.data?.sort((a: any, b: any) => b.id - a.id)
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

  async markPaid(id: number) {
    await this.dbService.upsert('registrations', { ...this.registrations.find((i: IRegistration) => i.id === id), paid: true })
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
          this.dbService.upsert('registrations', {
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
          await Promise.all(this.csvJSON(res.toString()).map(async (row, i) => {
            let tmpRow: IRegistration = {
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
              await this.dbService.upsert('registrations', tmpRow);
            }
          }));
          Swal.fire(
            '',
            'Data imported successfully',
            'success'
          );
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

}
