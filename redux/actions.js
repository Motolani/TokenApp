export const IS_SIGNED_IN = 'IS_SIGNED_IN';

export const isSignedIn = status => {
  try {
    return async dispatch => {
      dispatch({
        type: IS_SIGNED_IN,
        payload: status,
      });
    };
  } catch (error) {
    // Add custom logic to handle errors
  }
};
