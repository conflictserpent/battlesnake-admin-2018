import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => (
  <nav>
    <NavLink exact className="link" to="/team">
      Team
    </NavLink>
    <NavLink className="link" to="/team/snakes">
      Snakes
    </NavLink>
  </nav>
)

export default Nav
