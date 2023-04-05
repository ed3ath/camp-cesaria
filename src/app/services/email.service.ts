import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  emailTemplate = ''
  subject = ''
  constructor() {
    this.subject = `Camp Cesaria QR Code`
    this.emailTemplate = `<div class="align-left">
      <p>Dear Guest/s,</p>
      <p>Thank you for registering your {{var1}}, {{names}}, in Camp Cesaria's First Easter Egg Hunt Activity this coming Sunday, April 9, 2023.</p>
      <p>Please see the attachment for your {{var2}} QR {{qr}} that should be presented at the entrance and food kiosks.</p>
      <p>Please note:</p>
      <p>
      <ul>
        <li>P500 registration fee is inclusive of entrance to Camp Cesaria, Taters Popcorn, Egg Sandwich by K-Egg Kidapawan,
          pool access, entrance to the rabbit cove, face painting, bubble show, balloon twisting, easter egg hunting, and
          more games and prizes.</li>
        <li>Every adult has to pay P100 for the entrance, inclusive of pool access only.</li>
        <li>Please bring a floater or life vest for kids if you have any.</li>
        <li>Adults are <b>NOT</b> allowed to pick up easter eggs during the easter egg hunting.</li>
        <li><b>For late payments, please prepare a screenshot of your GCash transaction receipt.</b></li>
      </ul>
      </p>
      <p>If you have further questions, don't hesitate to contact us through our facebook page: <a
          href="https://www.facebook.com/campcesaria" target="_blank">Camp Cesaria</a></p>
    </div>`
  }

  getTemplate(names: string[]) {
    return this.emailTemplate.replace('{{var1}}', names.length > 1 ? 'kids' : 'kid').replace('{{names}}', names.join(', ')).replace('{{var2}}', names.length > 1 ? 'kids\'' : 'kid\'s').replace('{{qr}}', names.length > 1 ? 'codes' : 'code')
  }

  getMailto(names: string[], email: string) {
    const body = this.emailTemplate.replace('{{var1}}', names.length > 1 ? 'kids' : 'kid').replace('{{names}}', names.join(', ')).replace('{{var2}}', names.length > 1 ? 'kids\'' : 'kid\'s').replace('{{qr}}', names.length > 1 ? 'codes' : 'code')
    return `mailto:${email}?subject=${this.subject}&body=${body}`
  }
}
