import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ education: {
    degree,
    school,
    fieldofstudy,
    current,
    to,
    from,
    description
} }) => {
    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>
                <Moment format='YYY/MM/DD'>{from}</Moment>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                {!to ? 'Now' : <Moment format='YYY/MM/DD'>{to}</Moment>}
            </p>
            <p><strong>Degree:</strong>&nbsp;&nbsp;{degree}</p>
            <p><strong>Field Of Study:</strong>&nbsp;&nbsp;{fieldofstudy}</p>
            <p><strong>Description:</strong>&nbsp;&nbsp;{description}</p>
        </div>
    )
}

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired,
}

export default ProfileEducation
