import React, { useContext, useState } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useHistory, Link } from "react-router-dom";
import { login } from "../modules/authManager";
import "./Login.css";
import { UserProfileContext } from "./../modules/userProfileManager";
export default function Login() {
  const history = useHistory();
  const {setUserProfile, GetCurrentUserProfile2} = useContext(UserProfileContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const loginSubmit = (e) => {
    e.preventDefault();
    login(email, password)
      .then(() => {
        GetCurrentUserProfile2().then((res) => setUserProfile(res))
        history.push("/")})
      .catch(() => alert("Invalid email or password"));
  };

  return (
    <div className="container-login">
      <Form onSubmit={loginSubmit}>
        <fieldset>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input id="email" type="text" autoFocus onChange={e => setEmail(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input id="password" type="password" onChange={e => setPassword(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Button>Login</Button>
          </FormGroup>
          <em>
            Not registered? <Link to="register">Register</Link>
          </em>
        </fieldset>
      </Form>
    </div>
  );
}