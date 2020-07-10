import {NgModule} from '@angular/core';
import {DropdownDirective} from './dropdown.directive';
import {AlertComponent} from './alert/alert.component';
import {ShortenPipe} from './shorten.pipe';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {LoggingService} from '../logging.service';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    DropdownDirective,
    AlertComponent,
    LoadingSpinnerComponent,
    ShortenPipe,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
  ],
  exports: [
    DropdownDirective,
    AlertComponent,
    ShortenPipe,
    CommonModule,
    LoadingSpinnerComponent,
  ],
  providers: [LoggingService]
})
export class SharedModule {

}
