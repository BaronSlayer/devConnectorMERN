import React, { Fragment } from 'react'

const NotFound = () => {
    return (
        <Fragment>
            <h1 className="x-large text-primary">
                <span className="fas fa-exclamation-triangle"></span>&nbsp;Page Not Found
            </h1>
            <p className="large">This page does not exist</p>
        </Fragment>
    )
}

export default NotFound
