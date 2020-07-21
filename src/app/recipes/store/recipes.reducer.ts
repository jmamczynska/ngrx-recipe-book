import {Recipe} from '../recipe.model';
import {
  ADD_RECIPE,
  DELETE_RECIPE,
  FETCH_RECIPES,
  HTTP_REQUEST_FAILURE,
  RecipesActions,
  SET_RECIPES,
  UPDATE_RECIPE
} from './recipes.actions';

export interface State {
  recipes: Recipe[];
  httpCall: boolean;
  message: string;
}

const initialState: State = {
  recipes: [],
  httpCall: false,
  message: null
};

export function recipesReducer(state: State = initialState, action: RecipesActions) {
  switch (action.type) {
    case FETCH_RECIPES:
      return {
        ...state,
        httpCall: true,
        message: null
      };
    case SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
        httpCall: false,
        message: null
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      };
    case HTTP_REQUEST_FAILURE:
      return {
        ...state,
        httpCall: false,
        message: action.payload
      };
    default:
      return state;
  }
}
