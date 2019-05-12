import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextBoxWrapperComponent } from './text-box-wrapper/text-box-wrapper.component';
import { TextBoxComponent } from './text-box/text-box.component';

@NgModule({
  declarations: [AppComponent, TextBoxComponent, TextBoxWrapperComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
