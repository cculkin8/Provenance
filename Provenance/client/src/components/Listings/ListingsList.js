import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListingsContext } from '../../modules/listingsManager';
import Listing from './ListingListCard';
import { Link } from 'react-router-dom';


const ListingList = () => {
    const { listings, getAllListings, getListingsByUserProfileId } = useContext(
        ListingsContext
    );
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            getAllListings();
        } else {
            getListingsByUserProfileId(id);
        }
    }, [id]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="cards-column">
                    <Link to="/create">
                        <button>Create New Listing</button>
                    </Link>
                    {listings.map((listing) => {
                        return <Listing key={listing.id} listing={listing} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ListingList;