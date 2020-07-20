import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class RecipesEffects {

  private readonly url = 'https://ng-course-recipe-book-69787.firebaseio.com/recipes.json';

  @Effect()
  fetchRecipe = this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.httpClient.get<Recipe[]>(this.url);
      }),
      map((recipes: Recipe[]) => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      map((recipes: Recipe[]) => {
        return new RecipesActions.SetRecipes(recipes);
      })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.httpClient.put(this.url, recipesState.recipes);
      })
  );

  constructor(
      private actions$: Actions,
      private httpClient: HttpClient,
      private store: Store<fromApp.AppState>) {
  }
}
