import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import { loadUser } from "./actions/authActions";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import setAuthToken from "./utils/setAuthToken";
import CreateProfile from './components/profile-forms/CreateProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import EditProfile from './components/profile-forms/EditProfile';
import ProfilesList from './components/profiles/ProfilesList';
import ProfileCard from './components/profile-item/ProfileCard';
import Posts from './components/posts/PostsList';
import PostComponent from './components/post-item/PostComponent';

// Provider
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser);
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route exact path="/" component={Landing} />
					<section className="container">
						<Switch>
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/profiles" component={ProfilesList} />
							<Route exact path="/profile/:id" component={ProfileCard} />
							<PrivateRoute exact path="/dashboard" component={Dashboard} />
							<PrivateRoute exact path="/create-profile" component={CreateProfile} />
							<PrivateRoute exact path="/edit-profile" component={EditProfile} />
							<PrivateRoute exact path="/add-experience" component={AddExperience} />
							<PrivateRoute exact path="/add-education" component={AddEducation} />
							<PrivateRoute exact path="/posts" component={Posts} />
							<PrivateRoute exact path="/posts/:id" component={PostComponent} />
						</Switch>
						<Alert />
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
