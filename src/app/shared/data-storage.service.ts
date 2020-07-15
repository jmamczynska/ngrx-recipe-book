import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class DataStorageService {

  private readonly url = 'https://ng-course-recipe-book-69787.firebaseio.com/recipes.json';

  constructor(
      private httpClient: HttpClient,
      private recipeService: RecipeService) {
  }

  storeRecipes() {
    this.httpClient.put(this.url, this.recipeService.getRecipes())
        .subscribe(response => {
          console.log(response);
        });
  }

  getRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(this.url)
        .pipe(
            map((recipes: Recipe[]) => {
              return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
              });
            }),
            tap((recipes: Recipe[]) => {
              this.recipeService.setRecipes(recipes);
            }));
  }
}
