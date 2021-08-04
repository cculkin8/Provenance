import React, { useState, useEffect, createContext } from "react";
import { Spinner } from "reactstrap";
import firebase from "firebase/app";
import "firebase/auth";

export const UserProfileContext = createContext();

export function UserProfileProvider(props) {
  const apiUrl = "/api/userprofile";

  const [userProfile, setUserProfile] = useState()
  const [userProfiles, setUserProfiles] = useState([])
  const [currentUserId, setCurrentUserId] = useState(0);

  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  useEffect(() => {
      firebase.auth().onAuthStateChanged((u) => {
          setIsFirebaseReady(true);
      });
  }, []);
  useEffect(() => {
    // debugger
          if (props.isLoggedIn === true) {
          GetCurrentUserProfile2().then((response) => setCurrentUserId(response.id)
          );}
      }, [userProfile]);
  const getAllUserProfiles = () => {

    return getToken().then((token) =>
    
    fetch(`${apiUrl}`, {
      method: "GET",
      headers: {
         Authorization: `Bearer ${token}`}})
    .then(res => res.json())
    .then(setUserProfiles))
  }



  const getToken = () => firebase.auth().currentUser.getIdToken();

  const getUserProfile = (firebaseUserId) => {
    return getToken().then((token) =>
      fetch(`${apiUrl}/${firebaseUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(resp => {
        return resp.json()}));
  };

  const getUserProfileById = (userProfileId) => {
    return getToken().then((token) =>
    fetch(`${apiUrl}/getById/${userProfileId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json()))
  }
  const GetCurrentUserProfile2 = () => {
    return getToken().then((token) =>
    fetch(`${apiUrl}/GetCurrentUser3`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`}}) .then(res => { console.log(res)
        return res.json()}))}


  return (
    <UserProfileContext.Provider value={{ userProfiles, getToken, getUserProfile, getAllUserProfiles, getUserProfileById, setUserProfile, GetCurrentUserProfile2, currentUserId}}>
      {isFirebaseReady
        ? props.children
        : <Spinner className="app-spinner dark" />}
    </UserProfileContext.Provider>
  );
}