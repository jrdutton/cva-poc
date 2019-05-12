import { Component, Input, OnChanges, Optional, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html'
})
export class TextBoxComponent implements ControlValueAccessor, OnChanges {
  public value: string;

  @Input()
  title: string;

  @Input()
  submitted?: boolean;

  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.title + ' TEXT BOX CHANGES: ' + JSON.stringify(changes));
  }

  setText(value: string) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  isInvalid(): boolean {
    const retVal: boolean =
      ((this.submitted === true || this.submitted === undefined) &&
        this.controlDir &&
        this.controlDir.errors &&
        (this.controlDir.dirty || this.controlDir.touched)) ||
      false;
    console.log(this.title + ' TEXT BOX IS_INVALID: ' + retVal);
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
