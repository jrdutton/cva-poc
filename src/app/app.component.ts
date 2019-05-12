import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  submitted = false;

  textErrors = '';
  textValue = '';

  wrapperErrors = '';
  wrapperValue = '';

  formStatus = '';

  fg = this.fb.group({
    text: this.fb.control('', [Validators.required]),
    wrapper: this.fb.control(null, [Validators.required])
  });

  get text() {
    return this.fg.get('text') as FormControl;
  }

  get wrapper() {
    return this.fg.get('wrapper') as FormControl;
  }

  constructor(private fb: FormBuilder, private changeDetector: ChangeDetectorRef) {}

  submit() {
    this.submitted = true;
    // this.changeDetector.detectChanges();

    this.validateFormGroup(this.fg);
    // this.changeDetector.detectChanges();

    this.textErrors = JSON.stringify(this.text.errors);
    this.textValue = this.text.value || '{EMPTY}';

    this.wrapperErrors = JSON.stringify(this.wrapper.errors);
    this.wrapperValue = this.wrapper.value || '{EMPTY}';

    this.formStatus = this.fg.valid ? 'VALID' : 'INVALID';
  }

  validateFormGroup(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();

      if (control.controls) {
        this.validateFormGroup(control);
      }
    });
  }
}
