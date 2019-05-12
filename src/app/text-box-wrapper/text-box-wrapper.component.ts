import { Component, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function requiredIfTrue(requiredIfFunc: () => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (control.untouched) {
      return null;
    }
    if ((value == null || value === undefined || value === '') && requiredIfFunc()) {
      return {
        requiredIfTrue: { condition: requiredIfFunc() }
      };
    }
    return null;
  };
}

function innerControlErrors(component: TextBoxWrapperComponent): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors = Object.assign(component.wrapper1.errors || {}, component.wrapper2.errors || {});
    console.log('Wrapper1 INNER CONTROL ERRORS: ' + JSON.stringify(component.wrapper1.errors));
    console.log('Wrapper2 INNER CONTROL ERRORS: ' + JSON.stringify(component.wrapper2.errors));
    console.log('WRAPPER INNER CONTROL ERRORS: ' + JSON.stringify(errors));
    return Object.keys(errors).length ? errors : null;
  };
}

@Component({
  selector: 'app-text-box-wrapper',
  templateUrl: './text-box-wrapper.component.html'
})
export class TextBoxWrapperComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  public value: string;

  @Input()
  submitted?: boolean;

  get wrapper1() {
    return this.fg.get('wrapper1') as FormControl;
  }

  get wrapper2() {
    return this.fg.get('wrapper2') as FormControl;
  }

  fg = this.fb.group({
    /*
    wrapper1: this.fb.control('', requiredIfTrue(() => this.submitted === undefined || this.submitted === true)),
    wrapper2: this.fb.control('', requiredIfTrue(() => this.submitted === undefined || this.submitted === true))*/
    wrapper1: this.fb.control('', Validators.required),
    wrapper2: this.fb.control('', Validators.required)
  });

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(@Optional() @Self() public controlDir: NgControl, private fb: FormBuilder) {
    controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const self = this;

    const origMarkAsTouched = this.controlDir.control.markAsTouched;
    this.controlDir.control.markAsTouched = function() {
      (<any>Object).values(self.fg.controls).forEach(control => {
        control.markAsTouched();
      });
      origMarkAsTouched.apply(this, arguments);
    };

    const origUpdateValueAndValidity = this.controlDir.control.updateValueAndValidity;
    this.controlDir.control.updateValueAndValidity = function() {
      (Object as any).values(self.fg.controls).forEach(control => {
        control.updateValueAndValidity({ emitEvent: false });
      });
      origUpdateValueAndValidity.apply(this, arguments);
    };

    (Object as any).values(this.fg.controls).forEach(control => {
      control.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.value = this.joinValue();
        this.onChange(this.value);
        this.onTouched();
      });
    });

    (Object as any).values(this.fg.controls).forEach(control => {
      control.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.value = this.joinValue();
        this.onChange(this.value);
        this.onTouched();
      });
    });

    const ctrl = this.controlDir.control;
    const validators = ctrl.validator ? [ctrl.validator, innerControlErrors(this)] : innerControlErrors(this);
    ctrl.setValidators(validators);
    ctrl.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('WRAPPER CHANGES: ' + JSON.stringify(changes));
  }

  joinValue(): string {
    return [this.wrapper1.value, this.wrapper2.value].filter(e => e).join(',');
  }

  splitValue() {
    const values = this.value ? this.value.split(',') : [];
    this.fg.setValue(
      {
        wrapper1: values.length > 0 ? values[0] : '',
        wrapper2: values.length > 1 ? values[1] : ''
      },
      { emitEvent: false }
    );
    this.resetControls();
  }

  resetControls() {
    if (this.controlDir.control) {
      this.controlDir.control.markAsPristine();
      this.controlDir.control.markAsUntouched();
    }
    this.resetFormGroup(this.fg);
  }

  resetFormGroup(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();

      if (control.controls) {
        this.resetFormGroup(control);
      }
    });
  }

  isInvalid(): boolean {
    const retVal =
      ((this.submitted === true || this.submitted === undefined) &&
        this.controlDir &&
        this.controlDir.errors &&
        (this.controlDir.dirty || this.controlDir.touched)) ||
      false;
    console.log('WRAPPER IS_INVALID: ' + retVal);
    return retVal;
  }

  public onChange(newVal: string) {}

  public onTouched(_?: any) {}

  public writeValue(obj: string): void {
    this.value = obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {}
}
