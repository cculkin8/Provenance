import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListingContext } from '../../modules/ListingManager.js';
import Listing from './ListingListCard';
import { Link } from 'react-router-dom';


const ListingList = () => {
    const { listings, getAllListings, getListingsByUserProfileId } = useContext(
        ListingContext
    );
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            getAllListing();
        } else {
            getListingByUserProfileId(id);
        }
    }, [id]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="cards-column">
                    <Link to="/create">
                        <button>Create New Listing</button>
                    </Link>
                    {listings.map((post) => {
                        return <Listing key={listings.id} post={listings} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ListingList;