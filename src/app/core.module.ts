import {NgModule} from '@angular/core';
import {RecipeResolverService} from './recipes/recipe-resolver.service';

@NgModule({
  providers: [
    RecipeResolverService,
  ]
})
export class CoreModule {

}
