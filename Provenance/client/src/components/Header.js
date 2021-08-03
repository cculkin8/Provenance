import React, { useContext, useState, useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
import { logout } from '../modules/authManager';
import { UserProfileContext } from '../modules/UserProfileManager';
import Search from './SearchBar/Search';
import { ListingsContext } from '../modules/listingsManager';


export default function Header({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { currentUserId } = useContext(UserProfileContext);
  const { listings, getAllListings, getListingsByUserProfileId } = useContext(ListingsContext);
  const { id } = useParams();
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');

  useEffect(() => {
      if (!id) {
          getAllListings();
      } else {
          getListingsByUserProfileId(id);
      }
  }, [id]);
  const filterListings = (listings, query) => {
    if (!query) {
        return listings;
    }

    return listings.filter((listing) => {
        const listingTitle = listing.title.toLowerCase();
        return listingTitle.includes(query);
    });
};

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={RRNavLink} to="/">Provenance</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            { /* When isLoggedIn === true, we will render the Home link */}
            {isLoggedIn &&

              <React.Fragment>

                <NavItem>
                  <NavLink tag={RRNavLink} to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/UserProfile">Users</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/listings">
                    Listings
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink} to={`/listings/mylistings/`}>
                    My Listings
                  </NavLink>
                </NavItem>
                <div>
              <Search />
              <ul>
                {filterListings.map(listing => (
                    <li key={listing.id}>{listing.title}</li>
                ))}
              </ul>
              </div>
              </React.Fragment>


            }

          </Nav>
          <Nav navbar>
            {isLoggedIn &&
              <>
                <NavItem>
                  <a aria-current="page" className="nav-link"
                    style={{ cursor: "pointer" }} onClick={logout}>Logout</a>
                </NavItem>

              </>
            }
            {!isLoggedIn &&
              <>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/register">Register</NavLink>
                </NavItem>
              </>
            }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}
