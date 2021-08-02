import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { PostContext } from '../../modules/PostManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { UserProfileContext } from '../../modules/UserProfileManager';

const PostForm = () => {
    const dateFormatter = (date) => {
        const [yyyymmdd, time] = date.split('T');
        return yyyymmdd;
    };
    
    const { addPost, getPostById, updatePost } = useContext(PostContext);
    const { currentUserId } = useContext(UserProfileContext);
    const [userProfileId, setUserProfileId] = useState(0);
    const [imageLocation, setImageLocation] = useState('');
    const [categoryId, setCategoryId] = useState(1); // When Categories will work
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [publishDateTime, setPublishDateTime] = useState(
        dateFormatter(new Date().toISOString())
    );
    const [currentPost, setCurrentPost] = useState();

    const history = useHistory();

    const { id } = useParams();

    useEffect(() => {
        setTitle('');
        setImageLocation('');
        setContent('');
        setCategoryId(1);
        setPublishDateTime(dateFormatter(new Date().toISOString()));
        setCurrentPost();
        if (id) {
            getPostById(id).then(setCurrentPost);
        }
    }, [id]);
debugger
    useEffect(() => {
        if (currentPost) {
            if (id) {
                if (currentUserId !== currentPost.userProfileId) {
                    history.push('/');
                }
            }
            setPublishDateTime(dateFormatter(currentPost.publishDateTime));
            setCategoryId(currentPost.categoryId);
            setImageLocation(currentPost.imageLocation);
            setTitle(currentPost.title);
            setContent(currentPost.content);
        }
    }, [currentPost, currentUserId]);

    useEffect(() => {
        setUserProfileId(currentUserId);
    }, [currentUserId]);

    const handleClickSaveButton = (evt) => {
        if (!id) {
            const post = {
                imageLocation,
                title,
                content,
                categoryId,
                userProfileId,
                publishDateTime,
            };
            addPost(post).then((p) => {
                history.push('/posts');
            });
        } else {
            const newPost = { ...currentPost };
            newPost.title = title;
            newPost.imageLocation = imageLocation;
            newPost.categoryId = categoryId;
            newPost.content = content;
            newPost.publishDateTime = publishDateTime;
            updatePost(newPost).then(() => {
                history.push(`/posts/${newPost.id}`);
            });
        }
    };

    return (
        <Form className="container col-md-6">
            <h2>{id ? 'Edit Post' : 'New Post'}</h2>
            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Post Title"
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
export default PostForm