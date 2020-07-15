// LAST CHECK ON 9:25 PM - 15/07/2020

import t from './types';
import * as g from './globalActions';
import axios from 'axios';
import {api_URL} from '../config.json';

// NORMAL ACTIONS

export const app_go_back_analysis = () => {
    return ({
        type: t.APP_GO_BACK_ANALYSIS
    })
}

export const app_user_profile = (profile) => {
    return ({
        type: t.APP_USER_PROFILE,
        payload: profile
    })
}

export const app_set_historical_data = (data) => {
    return ({
        type: t.APP_SET_HISTORICAL_DATA,
        payload: data
    })
}

export const app_add_historical_data = (data) => {
    return ({
        type: t.APP_ADD_HISTORICAL_DATA,
        payload: data
    })
}

export const app_select_report = (id, view = true) => {
    return ({
        type: t.APP_SELECT_REPORT,
        payload: {report: id, view}
    })
}

export const app_report_view = (display) => {
    return ({
        type: t.APP_REPORT_VIEW,
        payload: display
    })
}

// DISPATCH ACTIONS

// action status: working fine
export const app_twitter_update = (tag) => dispatch => {
    dispatch(g.global_loading(true,"Updating Twitter username"));
    axios({
        method: 'post',
        url: api_URL+'updateTwitterTag',
        data: {
            tag
        }
    })
    .then(x => {
        dispatch(g.global_loading(false,''));
        dispatch(g.global_success('uUpdated Wwitter username'));
        dispatch ({
            type: t.APP_TWITTER_UPDATE,
            payload: tag
        })
    })
    .catch(x => {
        dispatch(g.global_loading(false));
        dispatch(g.global_error('Unable to update Twitter username'));
    })
}

// action status: working fine
export const app_perform_analysis = (type) => dispatch => {
    dispatch({
        type: t.APP_ONGOING_ANALYSIS,
        payload: type
    })
    dispatch({
        type: t.APP_ANALYSIS_STATE,
        payload: 1
    })
    axios({
        method: 'post',
        url: api_URL+'analysis',
        data: {
            type
        }
    })
    .then(({data}) => {
        dispatch({
            type: t.APP_ANALYSIS_STATE,
            payload: 2
        })
        dispatch(app_add_historical_data(data));
        dispatch(app_select_report(data.id, false))
        dispatch({
            type: t.APP_SEARCH_DATA_LOADED,
            payload: false
        })
    })
    .catch(error => {
        dispatch({
            type: t.APP_ANALYSIS_STATE,
            payload: 0
        })
        dispatch(g.global_error('Unable to perform analysis due to an unexpected error'))
    })
}

// action status: working fine
export const app_update_save_setting = (facebook_save, twitter_save) => dispatch => {
    dispatch(g.global_loading(true,"Updating Setting"));
    axios({
        method: 'post',
        url: api_URL+'updateSaveSetting',
        data: {
            facebook_save,
            twitter_save
        }
    })
    .then(x => {
        dispatch(g.global_loading(false,''));
        dispatch(g.global_success('Setting updated'));
        dispatch ({
            type: t.APP_UPDATE_SAVE_SETTING,
            payload: [facebook_save,twitter_save]
        })
    })
    .catch(x => {
        dispatch(g.global_loading(false));
        dispatch(g.global_error('Unable to update setting'));
    })
}

// action status: working fine
export const app_load_search_data = () => (dispatch, getState) => {
    let loaded = getState().app.search_data_loaded;
    if (!loaded) {
        axios({
            method: 'post',
            url: api_URL+'fetchSearchData'
        })
        .then(({data}) => {
            dispatch({
                type: t.APP_SEARCH_DATA_LOADED,
                payload: true
            })
            dispatch({
                type: t.APP_LOAD_SEARCH_DATA,
                payload: data
            })
        })
        .catch(err => {
            dispatch(g.global_error('Unable to fetch data'));
            dispatch({
                type: t.APP_SEARCH_DATA_LOADED,
                payload: true
            })
        })
        

    }
}