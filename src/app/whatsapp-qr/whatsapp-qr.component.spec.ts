import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappQrComponent } from './whatsapp-qr.component';

describe('WhatsappQrComponent', () => {
  let component: WhatsappQrComponent;
  let fixture: ComponentFixture<WhatsappQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
