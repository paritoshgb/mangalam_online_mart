
import { FETCH_CATEGORY } from '../actions/type';
const initialState = {
  availableCategory: [],
};

export default (state = initialState, action) => {
  switch(action.type){
    case FETCH_CATEGORY:
      return{
        ...state,
        availableCategory:[...state.availableCategory, action.category],
      }

      default:
        return state;
  }
};