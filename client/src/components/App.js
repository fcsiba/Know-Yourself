import React, { Component } from 'react';
import EntryView from './views/entryView';
import ApplicationView from './views/applicationView';
import {connect} from 'react-redux';
import * as actions from '../actions';

import LoadingScreen from './applicationComponents/LoadingScreen';
import ErrorMessage from './applicationComponents/ErrorMessage';
import SuccessMessage from './applicationComponents/SuccessMessage';

class App extends Component {
    
    componentDidMount () {
        this.props.entry_check_session();
    }

    render() {
        return (
            <>
                <LoadingScreen/>
                <ErrorMessage/>
                <SuccessMessage/>
                {this.props.logged? <ApplicationView/>:<EntryView/>}
            </>
            );
    }

}

const mstp = (state) => {
    return ({
        logged: state.entry.logged,
    });
}

export default connect(mstp, actions)(App);