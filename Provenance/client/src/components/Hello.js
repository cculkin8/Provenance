import { React, useState } from "react";
import Listing from './Listings/ListingListCard';
import "./Hello.css";

export default function Hello() {

  const [listings, setListings] = useState([])

  return (
    <div>
      <img className="centerme" alt="user img" />
      <div className="justify-content-center">
        <h2>Listings</h2>
        <div className="subscriptions">
          {listings.map((listing) => {
            return <Listing key={listing.id} listing={listing} />;
          })}
        </div>
      </div>
    </div>
  );
}

