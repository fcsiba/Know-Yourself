import t from '../actions/types';

const INITIAL_STATE = {
    sidemenu_open: false,
    application_view: 'analysis'
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case t.APPNAV_SIDEMENU_OPEN:
            return {...state, sidemenu_open: action.payload}
        case t.APPNAV_VIEW:
            return {...state, application_view: action.payload, sidemenu_open: false, }
        default:
            return state;
    }
}