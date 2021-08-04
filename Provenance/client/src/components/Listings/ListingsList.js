import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListingsContext } from '../../modules/listingsManager';
import Listing from './ListingListCard';
import { Link } from 'react-router-dom';
import { searchListing } from '../../modules/listingsManager';
import "./Listing.css";


const ListingList = () => {
    const { listings, getAllListings, getListingsByUserProfileId, setListings } = useContext(ListingsContext);
    const { id } = useParams();
    const [search, setSearch] = useState([])
    useEffect(() => {
        if (!id) {
            getAllListings();
        } else {
            getListingsByUserProfileId(id);
        }
    }, [id]);
    const handleInputChange = (event) => {
        const newSearch = {...search}
        let selectedVal = event.target.value
        newSearch[event.target.id] = selectedVal
        setSearch(newSearch)
    }
      const searchListings = (event) => {
        event.preventDefault()
        console.log(search.searchparam)
        searchListing(search.searchparam,true)
        .then(response => {
          setListings(response)
        })
      }
    return (
        <div className="container">
            <div className="row justify-content-center">
                    <Link to="/create">
                        <button>Create New Listing</button>
                    </Link>
                    <div>
                    <label htmlFor="header-search">
                    <span className="visually-hidden">Search Video</span>
                    </label>
                    <input
                    type="text"
                    id="searchparam"
                    placeholder="Search Videos"
                    name="s"
                    onChange={handleInputChange}/>
        <button type="submit" onClick={searchListings}>Search</button>
              </div>      
                <div className="listingcards">
                    {listings.map((listing) => {
                        return <Listing listing={listing} key={listing.id} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ListingList;