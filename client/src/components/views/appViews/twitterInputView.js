import React, {useState, useEffect} from 'react'

import { Container, TextField, Button } from '@material-ui/core';
import {connect} from 'react-redux';
import * as actions from '../../../actions';


import ViewTitle from '../../applicationComponents/ViewTitle';

function TwitterInputView(props) {

    const [tag, setTag] = useState('');
    
    useEffect(() => setTag(props.tag),[])

    return (
        <Container>
           <ViewTitle title="Link to Twitter"/>
            <form noValidate autoComplete="off">
                <TextField fullWidth value={tag} label="Twitter Username" variant="outlined" onChange={(e)=> setTag(e.target.value)} />
                <div className="space-1rem"></div>
                <Button
                    disabled={props.tag == tag}
                    onClick={()=>props.app_twitter_update(tag)}
                    size="large"
                    variant="contained"
                    fullWidth
                    color='primary'>
                        Update Twitter Username
                </Button>

            </form>
        </Container>
    )
}

const mstp = (state) => {
    return ({
        tag: state.app.profile?state.app.profile.twitterTag:'',
    });
}

export default connect(mstp,actions)(TwitterInputView);