import { React, useState } from "react";
import Listing from './Listings/ListingListCard';
import "./Hello.css";

export default function Hello() {

  const [listings, setListings] = useState([])

  return (
    <div>
      Hello
    </div>
  );
}


      // <div className="justify-content-center">
      // <img className="centerme" alt="user img" />
      //   <h2>Listings</h2>
      //   <div className="subscriptions">
      //     {listings.map((listing) => {
      //       return <Listing key={listing.id} listing={listing} />;
      //     })}
      //   </div>
      // </div>