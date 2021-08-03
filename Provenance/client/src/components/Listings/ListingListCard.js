import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import "./Listing.css"
const Listing = ({ listing }) => {
    return (
        <Card className="m-4">
            <p className="text-left px-2">
                Posted by: {listing.userProfile.displayName}
            </p>
            <img src={listing.imageLocation} />
            <CardBody>
                <p>
                    <Link to={`/posts/${listing.id}`}>
                        <strong>{listing.title}</strong>
                    </Link>
                </p>
            </CardBody>
        </Card>
    );
};
export default Listing;