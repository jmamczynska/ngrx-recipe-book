import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataStorageService} from '../shared/data-storage.service';
import {RecipeService} from './recipe.service';

@Injectable()
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private dateStorageService: DataStorageService, private recipeService: RecipeService) {
  }

  resolve(route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    const recipe = this.recipeService.getRecipes();
    if (recipe.length === 0) {
      return this.dateStorageService.getRecipes();
    } else {
      return recipe;
    }
  }
}
