import { Component, OnInit } from "@angular/core";
import { Subject_Service } from "app/services/Subject.Service.js";

@Component({
  selector: "app-whatsapp-qr",
  templateUrl: "./whatsapp-qr.component.html",
  styleUrls: ["./whatsapp-qr.component.scss"],
})
export class WhatsappQrComponent implements OnInit {
  qr: string | null = null;
  whatsappReady: boolean = false;

  accounts: string[] = ["account1", "account2", "account3"]; // example list
  accountId: string = "account1"; // default selected

  phoneNumber: string = "";
  message: string = "";

  private qrInterval: any;
  private statusInterval: any;

  constructor(public Subject_Service_: Subject_Service) {}

  ngOnInit() {
    this.initAccount();
  }

  /** Initialize session for the selected account */
  initAccount() {
    // Call backend to initialize session
    this.Subject_Service_.initAccount(this.accountId).subscribe(() => {
      this.loadQr();
      this.startPolling();
    });
  }

  /** Load QR code */
  loadQr() {
    this.Subject_Service_.qr(this.accountId).subscribe((res: { qr: string }) => {
      this.qr = res.qr;
    });
  }

  /** Start polling QR and status */
  startPolling() {
    if (this.qrInterval) clearInterval(this.qrInterval);
    if (this.statusInterval) clearInterval(this.statusInterval);

    this.qrInterval = setInterval(() => this.loadQr(), 5000);

    this.statusInterval = setInterval(() => {
      this.Subject_Service_.getWhatsappStatus(this.accountId).subscribe(
        (res: { ready: boolean }) => {
          this.whatsappReady = res.ready;
        }
      );
    }, 2000);
  }

  /** Send message */
  sendMessage() {
    if (!this.phoneNumber || !this.message) {
      alert("Please enter phone number and message");
      return;
    }

    this.Subject_Service_.sendMessage(this.accountId, {
      number: this.phoneNumber,
      message: this.message,
    }).subscribe(
      (res) => {
        console.log("Message sent", res);
        alert("Message sent successfully!");
      },
      (err) => {
        console.error("Error sending message", err);
        alert("Failed to send message");
      }
    );
  }
}
