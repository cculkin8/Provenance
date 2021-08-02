import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import {GetAllUsers} from './../../modules/userManager';
import UserProfile from './UserProfile';

export default function UserProfileList() {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [users, setUsers] = useState([]);

  const getUsers = () => {
    GetAllUsers().then(users => setUsers(users));
  };

  useEffect(() => {
    getUsers();
  }, []);

    return (
        <div className="container">
            <Navbar color="light" light expand="md">
                <NavbarBrand tag={RRNavLink} to="/UserProfile">Users</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <React.Fragment>
                            <NavItem>
                                <NavLink className="UserColor" tag={RRNavLink} to="/">Close</NavLink>
                            </NavItem>
                        </React.Fragment>
                    </Nav>
                </Collapse>
            </Navbar>
            <div>
            <div>
            <div className="UserList">
                <label style={{width: "12em"}}>Name </label>
                <label style={{width: "2em"}}> </label>
                <label style={{width: "14em", marginLeft:".5rem"}}>Display Name</label>
                <label style={{width: "8em",marginLeft:".5rem"}}>Edit</label>
                <label style={{width: "8em",marginLeft:"-1.5rem"}}>De-Activate</label>
            </div>
        {users.map((user) => (
          <UserProfile user={user} getUsers={getUsers} key={user.id} />
        ))}
    </div>
            </div>

        </div>
    );
}