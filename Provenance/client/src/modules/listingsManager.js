import React, { useState, useContext } from 'react';
import { UserProfileContext } from './userProfileManager';
import { getToken } from './authManager'

export const ListingsContext = React.createContext();

export const ListingsManager = (props) => {
    const { getToken } = useContext(UserProfileContext);
    const [listings, setListings] = useState([]);

    const getAllListings = () => {
        return getToken()
            .then((token) =>
                fetch('/api/listings', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            )
            .then((res) => res.json())
            .then(setListings);
    };

    const getListingsById = (id) => {
        return getToken()
            .then((token) =>
                fetch(`/api/listings/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            )
            .then((res) => res.json());
    };
    const addListing = (listing) => {
        return getToken().then((token) =>
            fetch('/api/listings', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listing),
            })
        );
    };

    const updateListing = (listing) => {
        return getToken().then((token) =>
            fetch(`/api/listings/${listing.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listing),
            }).then((res) =>{
                if (!res.ok) {
                    window.alert("You are unable to edit this listing, please try again later. Or maybe don't I'm not your boss")
                }
            })
        );
    };


    const getListingsByUserProfileId = (id) => {
        return getToken().then((token) =>
            fetch(`/api/listings/userprofileid/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then(setListings)
        );
    };
    const deleteListing = (id) => {
        return getToken().then((token) =>
            fetch(`/api/listings/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        );
    };

    return (
        <ListingsContext.Provider
            value={{ listings, getAllListings, getListingsById, getListingsByUserProfileId, deleteListing, addListing, updateListing, setListings }}
        >
            {props.children}
        </ListingsContext.Provider>
    );
};
export const searchListing = (criteria, order) => {
    return getToken().then((token) => {
  
      return fetch(`${baseUrl}/Search?q=${criteria}&sortDesc=${order}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("An unknown error occurred while trying to return listings");
        }
      });
    });
  };
const baseUrl = '/api/listings';
export const getAllUserListings = () => {
    return getToken().then((token) => {
        return fetch(`${baseUrl}/GetAllUserListings`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Something went wrong on the way didn't it?");
            };
        })
    })
};

