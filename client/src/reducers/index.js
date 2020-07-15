import { combineReducers } from 'redux';

import global from './globalReducers';
import entry from './entryReducers';
import appNav from './appNavReducers';
import app from './appReducers';

export default combineReducers({
    global,
    entry, 
    appNav,
    app
})