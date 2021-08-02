import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { editUser, getUserById, checkUnique } from "../../modules/userManager";
import { FormGroup, Container, Button, Form } from "reactstrap";



const UserProfileForm = () => {
    const [user, setUser] = useState({})
    const { id } = useParams();
    const history = useHistory();
    const [value, setValue] = useState();

    const handleInputChange = (event) => {
        const newUser = { ...user }
        let selectedValue = event.target.value
        newUser[event.target.id] = selectedValue
        setUser(newUser)
    }
    const handleSaveEvent = (click) => {
        click.preventDefault()
        checkUnique(user).then(resp => {
            let saveEdit = true;
            setUser(resp);
            if (resp.email.includes("!!Exists") ){
                alert(`This email ${resp.email} is already registered with us, please try logging in`)
                saveEdit = false;
            }
            if (resp.displayName.includes("!!Exists")) {
                alert(`The display Name ${resp.displayName} is unavailable, please choose another`)
                saveEdit = false;
            }
            if(saveEdit){
                editUser(user).then(resp => {
                    getUserById(id).then(() =>{
                        setValue(user.userTypeId)
                    });
                });
            }else
            {
                return;
            }
          });
        }          
    
    function handleSelectChange(event) {
        const newUser = { ...user }
        let selectedValue = parseInt(event.target.value);
        newUser[event.target.id] = selectedValue
        setUser(newUser)
    }
    const handleCancelSave = (click) => {
        click.preventDefault()
        history.push('/userprofile')
    }

    useEffect(() => {
        getUserById(id).then(setUser).then(() =>{
            setValue(user.userTypeId)
        } );
    }, [id])

    return (
        <Container className="justified-content-center">
            <Form onSubmit={(e) => handleSaveEvent(e)}>
                <FormGroup>
                    <label>First Name</label>
                    <input type="text"
                        id="firstName"
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                        className="form-control inputClass"
                        defaultValue={user.firstName} />
                    <label>Last Name</label>
                    <input type="text"
                        id="lastName"
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                        className="form-control inputClass"
                        defaultValue={user.lastName} />
                    <label>Diplay Name</label>
                    <input type="text"
                        id="displayName"
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                        className="form-control inputClass"
                        defaultValue={user.displayName} />
                </FormGroup>
                <FormGroup>
                    <label>Email</label>
                    <input type="text"
                        id="email"
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                        className="form-control inputClass"
                        defaultValue={user.email} 
                        readonly/>
                    <label>Image Location</label>
                    <input type="text"
                        id="imageLocation"
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                        className="form-control inputClass"
                        defaultValue={user.imageLocation} 
                        readonly/>
                </FormGroup>
                <FormGroup>
                    <select value={user.userTypeId} id="userTypeId" onChange={handleSelectChange}>
                        <option value={1}>Author</option>
                        <option value={2}>Admin</option>
                        
                    </select>
                </FormGroup>
            
            <Button className="article-btn">
                Save Entry
            </Button>            
            <Button className="article-btn"
                variant="warning"
                onClick={handleCancelSave}>
                Cancel
            </Button>
            </Form>

        </Container>
    )
}

export default UserProfileForm;