import './App.css';
import {useState} from 'react';
import React from 'react';
import MediumEditor from './mediumeditor.js';
//import MyNav from './mynav';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  NavbarText,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  function MyNav(){
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    return (
      <Navbar color="dark" dark>
      <NavbarBrand href="/" className="mr-auto">Meditations</NavbarBrand>
      <Button outline color="primary" onClick={()=>console.log('saved')}>Save</Button>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink href="/components/">Components</NavLink>
          </NavItem>
          <NavItem>
            <NavLink >GitHub</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
    );
  }

  return (
    <div className="App">
      <MyNav />
      <MediumEditor />
    </div>
  );
}

export default App;
