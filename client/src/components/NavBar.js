import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';

function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
            <div>
              {/* <NavLink to="/companies">Companies</NavLink> */}
              <Dropdown size="sm" className="explore-btn">
                  <Dropdown.Toggle variant>Explore</Dropdown.Toggle>
                  <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/companies">Companies</Dropdown.Item>                        
                      <Dropdown.Item as={Link} to="/departments">Departments</Dropdown.Item>                        
                      <Dropdown.Item as={Link} to="/employees">Employees</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
            </div>            

            <NavLink className="navbar-brand nav-brand" exact to="/">HR DATA</NavLink>

            <div>
              <NavLink to="/addmore">Add More</NavLink>
            </div>
        </nav>
    )
}

// bootstrap centering
// https://www.codeply.com/go/kTGlK9Axdk
export default NavBar;