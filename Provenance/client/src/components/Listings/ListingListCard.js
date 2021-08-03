import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import "./Listing.css"

const Listing = ({ listing }) => {
    return (
        <Card className="listlistcard">
            <p> Priced at: {listing.price}</p>
            <img src={listing.imageLocation} />
            <p className="text-left px-2">
                Posted by: {listing.userProfile.displayName}
            </p>
            <CardBody>
                <p>
                    <Link to={`/listings/${listing.id}`}>
                        <strong>{listing.title}</strong>
                    </Link>
                </p>
            </CardBody>
        </Card>
    );
};
export default Listing;