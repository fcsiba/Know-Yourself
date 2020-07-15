// LAST CHECK ON 9:25 PM - 15/07/2020

import t from './types';

export const appnav_sidemenu_open = (open) => {
    return ({
        type: t.APPNAV_SIDEMENU_OPEN,
        payload: open
    });
}

export const appnav_view_change = (view) => {
    return ({
        type: t.APPNAV_VIEW,
        payload: view
    });
}