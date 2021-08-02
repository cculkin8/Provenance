import React, { useEffect, useState } from 'react';
import { getAllUserListings } from '../../modules/ListingsManager';
import Listing from "./ListingListCard";
import "./Listing.css"
const MyListings = () => {

  const [ listings, setListings ] = useState([]);


  const fetchUserListings = () => {
    
    return getAllUserListings().then(listings => setListings(listings))
  }

  useEffect(() => {
    fetchUserListings();
  }, []);
  return (
    <>
      <h1>My Listings</h1>
      <div className="container">
        <div className="listingDiv">
          { listings.map((list) => (
            <Listing listing={ listing } key={ listing.id } />
          )) }
        </div>
      </div>
    </>
  )

};

export default MyListings; 