import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions'; 

import Header from '../applicationComponents/Header';
import BottomBar from '../applicationComponents/BottomBar';

import TwitterInputView from './appViews/twitterInputView';
import ProfileView from './appViews/profileView';
import AnalysisView from './appViews/analysisView';
import ReportView from './appViews/reportView';
import HomeView from './appViews/homeView';
import HistoryView from './appViews/historyView';
import SettingView from './appViews/settingView';
import SearchView from './appViews/searchView';

class EntryView extends Component {
    viewDisplayer = () => {
        switch (this.props.view) {
            case 'twitter':
                return <TwitterInputView/>;
            case 'profile': 
                return <ProfileView/>;
            case 'analysis':
                return <AnalysisView/>;
            case 'home':
                return <HomeView/>;
            case 'history':
                return <HistoryView/>;
            case 'setting':
                return <SettingView/>;
            case 'search':
                return <SearchView/>;
            default:
                return 'no view selected';
        }
    }

    render() { 
        return (
            <div>
                <Header/>
                <div className='view-holder'>
                    {
                        this.props.report_view?
                        <ReportView/>
                        :this.viewDisplayer()
                    }
                </div>
                <BottomBar/>
            </div>
        );
    }
}
 

const mstp = (state) => {
    return ({
        view: state.appNav.application_view,
        sidemenu_open: state.appNav.sidemenu_open,
        report_view: state.app.report_view
    });
}


export default connect(mstp,actions)(EntryView);