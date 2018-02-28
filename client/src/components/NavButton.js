import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Base = ({ history, newPath, text, ...remaining }) => (
  <Button
    type="button"
    {...remaining}
    onClick={() => history.push(newPath)}
  >
    { text }
  </Button>
)

Base.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  newPath: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export const NavButton = withRouter(Base)
