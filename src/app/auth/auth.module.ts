import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {FormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    AuthRoutingModule,
    SharedModule,
  ]
})
export class AuthModule {

}
