import React from 'react'

import { Typography } from '@material-ui/core';

export default function ViewTitle(props) {
    return (
        <div className='view-header-holder'>
            <Typography variant='h4' className='view-header'>{props.title}</Typography>
        </div>
    )
}
