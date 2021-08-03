import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ListingsContext } from '../../modules/listingsManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { UserProfileContext } from '../../modules/UserProfileManager';

const ListingForm = () => {
    const dateFormatter = (date) => {
        const [yyyymmdd] = date.split('T');
        return yyyymmdd;
    };
    
    const { addListing, getListingsById, updateListing } = useContext(ListingsContext);
    const { currentUserId } = useContext(UserProfileContext);
    const [userProfileId, setUserProfileId] = useState(0);
    const [imageLocation, setImageLocation] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
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
        setPublishDateTime(dateFormatter(new Date().toISOString()));
        setCurrentListing();
        if (id) {
            getListingsById(id).then(setCurrentListing);
        }
    }, [id]);

    console.log(currentUserId)
    console.log(currentListing?.userProfileId)
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
            setContent(currentListing.content);
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
                content,
                userProfileId,
                publishDateTime,
            };
            addListing(listing).then((p) => {
                history.push('/listings');
            });
        } else {
            const newListing = { ...currentListing };
            newListing.title = title;
            newListing.imageLocation = imageLocation;
            newListing.content = content;
            newListing.publishDateTime = publishDateTime;
            updateListing(newListing).then(() => {
                history.push(`/listings/${newListing.id}`);
            });
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
                <Label for="publishDateTime">Publication Date</Label>
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
            <Button onClick={handleClickSaveButton}>Submit</Button>
        </Form>
    );
};
export default ListingForm