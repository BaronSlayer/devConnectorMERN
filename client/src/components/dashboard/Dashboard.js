import React, { Fragment, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from '../layout/Spinner';
import DashboardButtons from './DashboardButtons';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';

const Dashboard = ({
	getCurrentProfile,
	deleteAccount,
	auth: { user },
	profile: { profile, loading }
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, []);
	return (loading && profile === null) ? (<Spinner />) : (<Fragment>
		<h1 className="large text-primary">Dashboard</h1>
		<p className="lead">
			<span className="fas fa-user"></span> Welcome, {user && user.name}
		</p>
		{
			(profile === null) ? (
				<Fragment>
					<p>You have not yet created a profile.  Please, add your information</p>
					<Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
				</Fragment>
			) : (
					<Fragment>
						<DashboardButtons />
						<Experience experience={profile.experience} />
						<Education education={profile.education} />

						<div className="my-2">
							<button className="btn btn-danger" onClick={() => deleteAccount()}>
								<span className="fas fa-user-minus"></span>&nbsp;&nbsp;Delete My Accout
							</button>
						</div>
					</Fragment>
				)
		}
	</Fragment>);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.authReducer,
	profile: state.profileReducer
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
