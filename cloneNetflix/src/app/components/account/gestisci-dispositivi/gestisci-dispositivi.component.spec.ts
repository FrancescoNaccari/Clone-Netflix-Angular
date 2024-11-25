import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciDispositiviComponent } from './gestisci-dispositivi.component';

describe('GestisciDispositiviComponent', () => {
  let component: GestisciDispositiviComponent;
  let fixture: ComponentFixture<GestisciDispositiviComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestisciDispositiviComponent]
    });
    fixture = TestBed.createComponent(GestisciDispositiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
