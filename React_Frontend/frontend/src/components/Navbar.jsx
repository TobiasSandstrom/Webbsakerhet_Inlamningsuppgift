import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'


const Navbar = () => {

  const { loginWithRedirect, logout , isAuthenticated} = useAuth0()


  return (
    <>
    <div className="navbar">
      <div className="navbar-links-container">
        <ul>
          <li><NavLink className="navbar-link" to="/">Hem</NavLink></li>
          <li><NavLink className="navbar-link" to="/post">Skriv blogginlägg</NavLink></li>
          <li><NavLink className="navbar-link" to="/blog">Bloggen</NavLink></li>
          {isAuthenticated && <li><NavLink className="navbar-link" to="/profile">Profil</NavLink></li>}
          {!isAuthenticated && <li><NavLink className="navbar-link" onClick={() => loginWithRedirect()}>Logga in</NavLink></li>}
          {isAuthenticated && <li><NavLink className="navbar-link" onClick={() => logout()}>Logga ut</NavLink></li>}
        </ul>

      </div>
    </div>
    
    </>
  )
}

export default Navbar