import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ListingsContext } from '../../modules/listingsManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { UserProfileContext } from '../../modules/userProfileManager';

const ListingForm = () => {
    const dateFormatter = (date) => {
        const [yyyymmdd] = date.split('');
        return yyyymmdd;
    };
    
    const { addListing, getListingsById, updateListing } = useContext(ListingsContext);
    const { currentUserId } = useContext(UserProfileContext);
    const [userProfileId, setUserProfileId] = useState(0);
    const [imageLocation, setImageLocation] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [content, setContent] = useState('');
    const [contact, setContact] = useState('');
     const [publishDateTime, setPublishDateTime] = useState(
         dateFormatter(new Date().toISOString())
     );
    const [currentListing, setCurrentListing] = useState();

    const history = useHistory();

    const { id } = useParams();

    useEffect(() => {
        setTitle('');
        setImageLocation('');
        setContent('');
        setPrice('');
        setContact('');
           setPublishDateTime(dateFormatter(new Date().toISOString()));
        setCurrentListing();
        if (id) {
            getListingsById(id).then(setCurrentListing);
        }
    }, [id]);


    useEffect(() => {
        if (currentListing) {
            if (id) {
                if (currentUserId != currentListing.userProfileId) {
                    history.push('/');
                }
            }
               setPublishDateTime(dateFormatter(currentListing.publishDateTime));
            setImageLocation(currentListing.imageLocation);
            setTitle(currentListing.title);
            setPrice(currentListing.price);
            setContent(currentListing.content);
            setContact(currentListing.contact);
        }
    }, [currentListing, currentUserId]);

    useEffect(() => {
        setUserProfileId(currentUserId);
    }, [currentUserId]);

    const handleClickSaveButton = (evt) => {
        if (!id) {
            const listing = {
                imageLocation,
                title,
                price,
                content,
                userProfileId,
                contact,
                   publishDateTime,
            };
            addListing(listing).then((p) => {
                history.push('/listings');
            });
        } else {
            const newListing = { ...currentListing };
            newListing.title = title;
            newListing.price = price;
            newListing.imageLocation = imageLocation;
            newListing.content = content;
            newListing.contact = contact;
            delete newListing.userProfile
            newListing.publishDateTime = publishDateTime;
            updateListing(newListing).then(() => {
                history.push(`/listings/${newListing.id}`);
            });
            console.log(newListing)
        }
    };

    return (
        <Form className="container col-md-6">
            <h2>{id ? 'Edit Listing' : 'New Listing'}</h2>
            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Listing Title"
                    autoComplete="off"
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    value={title}
                />
            </FormGroup>
            <FormGroup>
                <Label for="price">Price</Label>
                <Input
                    type="text"
                    name="price"
                    id="price"
                    placeholder="Listing Price"
                    autoComplete="off"
                    onChange={(e) => {
                        setPrice(e.target.value);
                    }}
                    value={price}
                />
            </FormGroup>
            <FormGroup>
                <Label for="imageLocation">Image URL</Label>
                <Input
                    type="text"
                    name="imageLocation"
                    id="imageLocation"
                    placeholder="Header Image URL"
                    autoComplete="off"
                    onChange={(e) => {
                        setImageLocation(e.target.value);
                    }}
                    value={imageLocation}
                />
            </FormGroup>
            <FormGroup>
                <Label for="publishDateTime">Listing Date</Label>
                <Input
                    type="date"
                    name="publishDateTime"
                    id="publishDateTime"
                    onChange={(e) => {
                        setPublishDateTime(e.target.value);
                    }}
                    value={publishDateTime}
                />
            </FormGroup>
            <FormGroup>
                <Label for="content">Content</Label>
                <Input
                    type="textarea"
                    name="content"
                    id="content"
                    placeholder="Content"
                    autoComplete="off"
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                    value={content}
                />
            </FormGroup>
            <FormGroup>
                <Label for="contact">Contact infomartion</Label>
                <Input
                    type="textarea"
                    name="contact"
                    id="contact"
                    placeholder="Contact infomartion"
                    autoComplete="off"
                    onChange={(e) => {
                        setContact(e.target.value);
                    }}
                    value={contact}
                />
            </FormGroup>
            <Button onClick={handleClickSaveButton}>Submit</Button>
        </Form>
    );
};
export default ListingForm