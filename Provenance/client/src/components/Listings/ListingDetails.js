import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory} from 'react-router-dom';
import { ListingsContext } from "../../modules/listingsManager";
import { UserProfileContext } from '../../modules/userProfileManager.js';
import "./Listing.css"


export const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState();
    const { getListingsById, deleteListing } = useContext(ListingsContext);
    const history = useHistory();
    const { currentUserId } = useContext(UserProfileContext);

    useEffect(() => {
        getListingsById(id).then(setListing);
    }, []);

    const handleDelete = () => {
        if (window.confirm('Are you sure?')) {
            deleteListing(listing.id).then(() => {
                history.push(`/listings/`);
            });
        }
    };

    
    const handleDate = () => {
        let date = new Date(listing.publishDateTime).toLocaleDateString('en-US');
        return date;
    };

    console.log(listing?.userProfileId)


    if (!listing) {
        return null;
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-sm-12 col-lg-6" id="holdingall">
                <img className="listingImageA" src={listing.imageLocation} />
                    <h1>{listing.title}</h1>
                    <h3>Priced at: ${listing.price}</h3>
                    <div className="listing-subheader">
                        <p>
                            <strong>Author:</strong>{' '}
                            {listing.userProfile?.displayName}
                        </p>
                        <p> <strong>Publication Date:</strong> {handleDate()} </p>
                    </div>
                    <div className = "content">
                    <p>{listing.content}</p>
                    <p>{listing.contact}</p>
                    </div>
                    {currentUserId === listing.userProfileId ? (
                    <a className="buttons">
                    <button className="fas fa-trash-alt fa-2x" onClick={handleDelete} style={{ cursor: 'pointer' }}>Delete</button>
                    <button className="far fa-edit fa-2x" style={{ cursor: 'pointer' }} onClick={() => { history.push(`/edit/${listing.id}`);}}>Edit</button>
                      </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
};