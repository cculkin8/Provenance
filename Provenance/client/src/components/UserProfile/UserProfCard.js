import { React, useState, useEffect } from "react";
import { Card, CardBody, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { getUserById,DeleteUser, activateUser  } from "../../modules/userManager";
import { useHistory, useParams } from "react-router";

const UserProfCard = () => {
    const { id } = useParams();
    const history = useHistory();
    const [isdeleted, setIsdeleted] = useState("");
    const [user, setUser] = useState({});
    useEffect(() => {
        getUserById(id).then(setUser);
    }, []);
    const handleClick = (user, handleId) => {
        switch (handleId) {
            case 0:
                history.push(`/userprofile/edit/${user.id}`);
                break;
            case 1:
                var result = window.confirm(`Are you sure you want to delete ${user.fullName}?`);
                if (result) {
                    DeleteUser(user.id).then(history.push(`/userprofile`))
                }
                break;
            case 2:
                var actResult = window.confirm(`Are you sure you want to activate ${user.fullName}?`);
                if (actResult) {
                    activateUser(user.id).then(history.push(`/userprofile`))
                }
                break;
            case 3:
                history.push(`/userprofile`);
                break;
            default:
                return;
        }
    }
    return (
        <div>
            <h3>User Details</h3>
            <Card>
                <CardBody>
                    <Form>
                        <Row form>

                        </Row>
                        <Row form style={{ marginLeft: "40%", width: "400em"}}>
                            <Col md={3}>
                                <FormGroup>
                                    <label><b>Display Name:</b></label>
                                    <label style={{marginLeft: ".5rem" }}> {user.displayName} </label>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label style={{marginLeft: ".5rem" }}><img src={user.imageLocation}/></label>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label><b>Email:</b></label>
                                    <label style={{marginLeft: ".5rem"}}>{user.email}</label>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label><b>Joined:</b></label>
                                    <label style={{marginLeft: ".5rem" }}>{user.createDateTime}</label>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label><b>Role:</b></label>
                                    {(user.userTypeId === 1) && <label style={{ width: "12em", marginLeft: ".5rem" }}>Author</label>}
                                    {(user.userTypeId === 2) && <label style={{ width: "12em", marginLeft: ".5rem" }}>Admin</label>}
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            <div style={{ marginLeft: "40%"}}>
                <button type="button" onClick={() => handleClick(user, 0)} style={{ width: "5em", marginLeft: ".5rem" }}>Edit</button>
                {!user.isDeleted && <button type="button" onClick={() => handleClick(user, 1)} style={{ width: "8em", marginLeft: ".5rem" }}>De-Activate</button>}
                {user.isDeleted && <button type="button" onClick={() => handleClick(user, 2)} style={{ width: "8em", marginLeft: ".5rem" }}>Activate</button>}
                <button type="button" onClick={() => handleClick(user, 3)} style={{ width: "5em", marginLeft: "3rem" }}>Return</button>
            </div>
        </div>
    )
}

export default UserProfCard;