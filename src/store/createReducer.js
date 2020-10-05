export default ({ namespace, state: initialState, reducers }) => (
  state = initialState,
  action,
) => {
  const [prefix, type] = action.type.split('/');

  if (namespace === prefix && reducers[type]) {
    return reducers[type](state, { payload: action.payload });
  }

  return state;
};
