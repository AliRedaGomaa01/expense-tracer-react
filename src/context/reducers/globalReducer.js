export default function globalReducer(state, action) {
    switch (action.type) {
        case "SET_STATE":
            return {...action.payload };
        case "RESET_AUTH":
            localStorage.removeItem("auth");
            return {
                ...state,
                auth: {
                    user: null,
                    token: null,
                },
            };
        case "SET_FLASH_MSG":
            return {...state, flashMsg: action.payload };
        case "CLEAR_FLASH_MSG":
            return {...state, flashMsg: { success: "", error: "" } };
        default:
            return state;
    }
}