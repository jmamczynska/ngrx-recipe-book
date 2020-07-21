import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipes from '../store/recipes.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;
  isLoading = false;
  error: string = null;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store.select('recipes')
        .subscribe((recipesState: fromRecipes.State) => {
          this.recipes = recipesState.recipes;
          this.isLoading = recipesState.httpCall;
          this.error = recipesState.message;
        }
    );
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
