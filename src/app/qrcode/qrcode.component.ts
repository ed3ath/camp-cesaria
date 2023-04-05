import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

import { EmailService } from 'src/app/services/email.service';

interface URL {
  name: string;
  email: string;
  url: SafeUrl;
  kidIndex: number
}

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  urls: URL[] = []
  constructor(
    public dialogRef: MatDialogRef<QrcodeComponent>,
    @Inject(MAT_DIALOG_DATA) public qrData: any,
    public emailService: EmailService
  ) { }

  ngOnInit(): void {
  }

  formatName(id: number, kidIndex: number, name: string) {
    return JSON.stringify({
      id,
      kidIndex,
      name
    });
  }

  onChangeURL(url: SafeUrl, name: string, kidIndex: number) {
    this.urls.push({
      name,
      url,
      kidIndex
    } as URL);
  }

  async genTemplate() {
    const qrImages = await Promise.all(this.urls.map(async (data: URL) => {
      const img: any = document.querySelector(`#card${data.kidIndex + 1}`);
      const canvas = await html2canvas(img, { backgroundColor: null });
      return `<img src='${canvas.toDataURL("image/png")}'>`;
    }));
    Swal.fire({
      title: 'Email Template',
      html: `<p class="align-left">${this.qrData.email}</p><hr>${this.emailService.getTemplate(this.qrData.kids)}<hr>${qrImages.join('<br>')}`,
      focusConfirm: false
    });
  }

}
