import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';

interface URL {
  name: string;
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
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  formatName(id: number, kidIndex: number, name: string) {
    return JSON.stringify({
      id,
      kidIndex,
      name
    })
  }

  onChangeURL(url: SafeUrl, name: string, kidIndex: number) {
    this.urls.push({
      name,
      url,
      kidIndex
    } as URL)
  }

  async downloadQRs() {
    await Promise.all(this.urls.map(async (data: URL) => {
      const img: any = document.querySelector(`#card${data.kidIndex + 1}`);
      const canvas = await html2canvas(img)
      const textToSaveAsURL = canvas.toDataURL("image/png");
      const downloadLink = document.createElement('a');
      downloadLink.download = `${data.name}.png`;
      downloadLink.innerHTML = 'Download File';
      downloadLink.href = textToSaveAsURL;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }))
  }

}
