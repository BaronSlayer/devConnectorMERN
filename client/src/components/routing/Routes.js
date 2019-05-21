import React from 'react';
import { Route, Switch } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "../routing/PrivateRoute";
import CreateProfile from '../profile-forms/CreateProfile';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import EditProfile from '../profile-forms/EditProfile';
import ProfilesList from '../profiles/ProfilesList';
import ProfileCard from '../profile-item/ProfileCard';
import Posts from '../posts/PostsList';
import PostComponent from '../post-item/PostComponent';
import NotFound from '../layout/NotFound';

const Routes = () => {
    return (
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
                <Route component={NotFound} />
            </Switch>
            <Alert />
        </section>
    )
}

export default Routes
