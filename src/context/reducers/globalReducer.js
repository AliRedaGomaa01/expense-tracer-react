export default function globalReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, ...action.dataObject };
    default:
      return state;
  }
}
