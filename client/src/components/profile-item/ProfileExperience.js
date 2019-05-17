import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ experience: {
    title,
    company,
    location,
    current,
    to,
    from,
    description
} }) => {
    return (
        <div>
            <h3 className="text-dark">{company}</h3>
            <p>
                <Moment format='YYY/MM/DD'>{from}</Moment>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                {!to ? 'Now' : <Moment format='YYY/MM/DD'>{to}</Moment>}
            </p>
            <p><strong>Position:</strong>&nbsp;&nbsp;{title}</p>
            <p><strong>Description:</strong>&nbsp;&nbsp;{description}</p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired,
}

export default ProfileExperience
