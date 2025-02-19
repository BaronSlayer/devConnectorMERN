import React from 'react';
import { Link } from 'react-router-dom';

const DashboardButtons = () => {
    return (
        <div className="dash-buttons">
            <Link to="/edit-profile" className="btn btn-light">
                <i className="fas fa-user-circle text-primary"></i>
                &nbsp;&nbsp;Edit Profile
        </Link>
            <Link to="/add-experience" className="btn btn-light">
                <i className="fab fa-black-tie text-primary"></i>
                &nbsp;&nbsp;Add Experience
        </Link>
            <Link to="/add-education" className="btn btn-light">
                <i className="fas fa-graduation-cap text-primary"></i>
                &nbsp;&nbsp;Add Education
        </Link>
        </div>
    )
}

export default DashboardButtons
