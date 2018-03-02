import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = (props) => (
  <nav>
    <NavLink exact className="link" to="/team">
      Team
    </NavLink>
    <NavLink className="link" to="/team/snakes">
      Snakes
    </NavLink>
    {props.bountyCollector && (
      <NavLink className="link" to="/bounty">
        Bounty
      </NavLink>
    )}
  </nav>
)


export default Nav
