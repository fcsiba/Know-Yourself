import t from '../actions/types';

const INITIAL_STATE = {
    analysis_state: 0, // 0 => button view, 1 => performing, 2 => completed 
    ongoing_analysis: null,
    historical_data: [],
    selected_report: 1594820859288,
    report_view: true,
    profile: null,
    search_data_loaded: false,
    search_data: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case t.APP_TWITTER_UPDATE:
            return {...state, profile: {...state.profile, twitterTag: action.payload}}
        case t.APP_ANALYSIS_STATE:
            return {...state, analysis_state: action.payload}
        case t.APP_ONGOING_ANALYSIS:
            return {...state, ongoing_analysis: action.payload}
        case t.APP_GO_BACK_ANALYSIS:
            return {...state, ongoing_analysis: null, analysis_state: 0}
        case t.APP_REPORT_VIEW:
            return {...state, report_view: action.payload}
        case t.APPNAV_VIEW: 
            return {...state, report_view: false}
        case t.APP_SELECT_REPORT:
            return {...state, report_view:action.payload.view, selected_report: action.payload.report}
        case t.APP_USER_PROFILE:
            return {...state, profile: action.payload}
        case t.APP_SET_HISTORICAL_DATA:
            return {...state, historical_data: action.payload}
        case t.APP_ADD_HISTORICAL_DATA:
            return {...state, historical_data: {...state.historical_data, [action.payload.id]:action.payload}}
        case t.APP_UPDATE_SAVE_SETTING:
            return {...state, profile: {...state.profile, twitter_save: action.payload[1], facebook_save: action.payload[0]}}
        case t.APP_SEARCH_DATA_LOADED:
            return {...state, search_data_loaded: action.payload}
        case t.APP_LOAD_SEARCH_DATA:
            return {...state, search_data: action.payload}
        default:
            return state;
    }
}