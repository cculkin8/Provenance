import { React, useContext } from "react";
import Listing from './Listings/ListingListCard';
import "./Hello.css";
import banner2 from "./../Images/banner2.jpg"
import { ListingsContext } from '../modules/listingsManager';

export default function Hello() {
  const { listings, getAllListings, getListingsByUserProfileId, setListings } = useContext(ListingsContext);

  return (
    <div>
      <img className="centerme" src={banner2} alt="user img" />
      <div className="justify-content-center">
        <h2 className="justify-content-center">Browse All Listings</h2>
        <div className="listingcards">
                    {listings.map((listing) => {
                        return <Listing listing={listing} key={listing.id} />;
                    })}
                </div>
      </div>
    </div>
  );
}

