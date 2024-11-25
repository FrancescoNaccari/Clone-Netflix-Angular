import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciPagamentoComponent } from './gestisci-pagamento.component';

describe('GestisciPagamentoComponent', () => {
  let component: GestisciPagamentoComponent;
  let fixture: ComponentFixture<GestisciPagamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestisciPagamentoComponent]
    });
    fixture = TestBed.createComponent(GestisciPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
