import React, {useState, useEffect} from 'react'

import { Container, TextField, Typography, InputAdornment, Paper, FormControlLabel, Checkbox, List, ListItem } from '@material-ui/core';
import {connect} from 'react-redux';
import * as actions from '../../../actions';

import { Search, Info, Twitter, Facebook } from '@material-ui/icons';

import ViewTitle from '../../applicationComponents/ViewTitle';

const time_formatter = (time) => {
    let new_time = new Date(time);
    let hours = new_time.getHours();
    let minutes = "0" + new_time.getMinutes();
    let seconds = "0" + new_time.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    let d = new_time.getDate();
    let m = new_time.getMonth();
    let y = new_time.getFullYear();
    return `${formattedTime} ${d}/${m}/${y}`
}

const SearchInput = ({value, changeValue}) => {
    return (
        <TextField
        fullWidth
        value={value}
        onChange={changeValue}
        placeholder="Search posts"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    )
}

const SearchItem = ({data}) => {
    return (
        <ListItem className='search-item'>
            <div className='search-item-meta'>
                <div className='search-item-socialmedia'>
                    {data.from== 'Twitter'? <Twitter/>:<Facebook/>}
                    &nbsp;
                    <Typography>
                        {data.from}
                    </Typography>
                </div>
                <div>
                    <Typography>
                        {time_formatter(data.time)}
                    </Typography>
                </div>
            </div>
            <div className='search-item-text'>
                <Typography>{data.text}</Typography>
            </div>
            <div className='search-item-sentiment'>
                <div>
                    <Typography>{data.sentiment}</Typography>
                </div>
            </div>        
        </ListItem>
    );
}

const SearchResult = ({data, search_term, facebook, twitter, height}) => {
    if (!data || data.length == 0) {
        return (
            <Paper id="complete_search_result" style={{padding: '10px'}} variant='outlined'>
                <Typography variant="h6" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Info/>&nbsp;No data</Typography>
                <Typography>Seems like there is no data saved to search for</Typography>
            </Paper>
        )
    }
    let facebook_data = [];
    let twitter_data = [];
    if (facebook && data.facebook) {
        facebook_data = Object.keys(data.facebook).map(x => {return ({...data.facebook[x], from: 'Facebook'})})
    }
    if (twitter && data.twitter) {
        twitter_data = Object.keys(data.twitter).map(x => {return ({...data.twitter[x], from: 'Twitter'})})
    }
    let data_to_display = facebook_data.concat(twitter_data);
    let filtered_data =  data_to_display.filter(x => x.text.toLowerCase().includes(search_term.toLowerCase()))
    return (
        <Paper id="complete_search_result" style={{ height:height-10, overflow: 'scroll'}} variant='outlined'>
            <List>
              {filtered_data.map(x => <SearchItem key={x.id} data={x}/>)}
            </List>
        </Paper>
    )
}

class SearchView extends React.Component {

    state = {search_term: '', facebook: true, twitter: true, height: 0}

    componentDidMount () {
        this.props.app_load_search_data();
        const bottombarheight = document.getElementById('bottom-bar').clientHeight;
        const innerviewtop = document.getElementById('complete_search_result').offsetTop;
        const windowheight = window.innerHeight;
        this.setState({height: windowheight-innerviewtop-bottombarheight});
    }

    render() {
        return (
            <Container>
                <ViewTitle title="Search posts"/>
                <SearchInput changeValue={(e) => this.setState({search_term: e.target.value})} value={this.state.search_term} />
                <div style={{display: 'flex'}}>
                    <FormControlLabel
                        style={{flex:1}}
                        control={<Checkbox checked={this.state.facebook} onChange={(e) => this.setState({facebook: !this.state.facebook})} color="primary" />}
                        label="Facebook"
                        />
                    <FormControlLabel
                        style={{flex:1}}
                        control={<Checkbox checked={this.state.twitter} onChange={(e) => this.setState({twitter: !this.state.twitter})} color="primary" />}
                        label="Twitter"
                        />
                </div>
                <div className='space-1rem'></div>
                <SearchResult  height={this.state.height} facebook={this.state.facebook} twitter={this.state.twitter} data={this.props.data} search_term={this.state.search_term}/>
            </Container>
        )
    }

}

const mstp = (state) => {
    return ({
        twitterCheck: state.app.profile?state.app.profile.twitter_save == true:false,
        facebookCheck: state.app.profile?state.app.profile.facebook_save == true:false,
        data: state.app.search_data
    });
}

export default connect(mstp,actions)(SearchView);