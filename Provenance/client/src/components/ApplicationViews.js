import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ListingsList from "./Listings/ListingsList";
import UserProfileList from './UserProfile/UserProfileList';
import UserProfileForm from './UserProfile/UserProfileForm';
import UserProfCard from './../components/UserProfile/UserProfCard';
import ListingsForm from "./Listings/ListingsForm";
import Hello from "./Hello";
import MyListings from "./Listings/MyListings";
import { ListingDetails } from "./Listings/ListingDetails";

export default function ApplicationViews({ isLoggedIn }) {
  return (
    <main>
      <Switch>
        <Route path="/" exact>
          {isLoggedIn ? <Hello /> : <Redirect to="/login" />}
        </Route>

        <Route path="/listings/MyListings" exact>
          <MyListings />
        </Route>

        <Route path="/listings" exact>
          {isLoggedIn ? <ListingsList /> : <Redirect to="/login" />}
        </Route>

        <Route path="/listings/:id" exact>
          {isLoggedIn ? <ListingDetails /> : <Redirect to="/login" />}
        </Route>
        <Route path="/?s=:id" exact>
          {isLoggedIn ? <ListingDetails /> : <Redirect to="/login" />}
        </Route>

        <Route path="/create" exact>
          {isLoggedIn ? <ListingsForm /> : <Redirect to="/login" />}
        </Route>

        <Route path="/edit/:id" exact>
          {isLoggedIn ? <ListingsForm /> : <Redirect to="/login" />}
        </Route>

        <Route path="/userprofile" exact>
        {isLoggedIn ? <UserProfileList /> : <Redirect to="/login" />}
        </Route>
         
        <Route path="/userprofile/:id" exact>
        {isLoggedIn ? <UserProfCard /> : <Redirect to="/login" />}
        </Route>

        <Route path="/userprofile/edit/:id">
          {isLoggedIn ? <UserProfileForm /> : <Redirect to="/login" />}
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </main>
  );
}
