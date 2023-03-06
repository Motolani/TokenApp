import {IS_SIGNED_IN} from './actions';

const initialState = {
  loginStatus: false,
};

function reducers(state = initialState, action) {
  switch (action.type) {
    case IS_SIGNED_IN:
      return {...state, loginStatus: action.payload};

    default:
      return state;
  }
}

export default reducers;
