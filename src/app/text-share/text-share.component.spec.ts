import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextShareComponent } from './text-share.component';

describe('TextShareComponent', () => {
  let component: TextShareComponent;
  let fixture: ComponentFixture<TextShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextShareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
