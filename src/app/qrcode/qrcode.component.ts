import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface URL {
  name: string;
  url: SafeUrl;
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

  onChangeURL(url: SafeUrl, name: string) {
    this.urls.push({
      name,
      url
    } as URL)
  }

  downloadQRs() {
    this.urls.forEach((data: URL) => {
      const downloadLink = document.createElement('a');
      downloadLink.download = `${data.name}.png`;
      downloadLink.innerHTML = 'Download File';
      downloadLink.href = `${this.sanitizer.sanitize(SecurityContext.URL, data.url)}`;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })

  }

}
