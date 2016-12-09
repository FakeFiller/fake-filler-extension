import React from 'react';
import { Link, withRouter, routerShape } from 'react-router';

const NavItem = (props) => {
  const { router, to, children } = props;

  return (
    <li className={router.isActive(to) ? 'active' : null}>
      <Link to={to}>{children}</Link>
    </li>
  );
};

NavItem.propTypes = {
  children: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired,
  router: routerShape.isRequired,
};

export default withRouter(NavItem);
