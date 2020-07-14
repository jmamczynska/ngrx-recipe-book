import {NgModule} from '@angular/core';
import {RecipeService} from './recipes/recipe.service';
import {DataStorageService} from './shared/data-storage.service';
import {RecipeResolverService} from './recipes/recipe-resolver.service';

@NgModule({
  providers: [
    RecipeService,
    DataStorageService,
    RecipeResolverService,
  ]
})
export class CoreModule {

}
