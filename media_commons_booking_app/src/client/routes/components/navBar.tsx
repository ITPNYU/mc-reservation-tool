import { Box, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { DatabaseContext } from './Provider';
import { PagePermission } from '../../../types';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Title = styled(Typography)`
  width: fit-content;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;

const Nav = styled(Toolbar)(({ theme }) => ({
  border: `1px solid ${theme.palette.custom.border}`,
}));

const Divider = styled(Box)(({ theme }) => ({
  width: '2px',
  height: '32px',
  background: theme.palette.custom.gray,
  margin: '0px 20px',
}));

export default function NavBar() {
  const navigate = useNavigate();
  const { pagePermission, userEmail } = useContext(DatabaseContext);
  const [selectedView, setSelectedView] = useState<PagePermission>(
    PagePermission.BOOKING
  );

  const netId = userEmail?.split('@')[0];

  const handleRoleChange = (e: any) => {
    setSelectedView(e.target.value as PagePermission);
  };

  const handleClickHome = () => {
    setSelectedView(PagePermission.BOOKING);
    navigate('/');
  };

  useEffect(() => {
    switch (selectedView) {
      case PagePermission.BOOKING:
        navigate('/');
        break;
      case PagePermission.PA:
        navigate('/pa');
        break;
      case PagePermission.ADMIN:
        navigate('/admin');
        break;
    }
  }, [selectedView]);

  const dropdown = useMemo(() => {
    if (
      pagePermission !== PagePermission.ADMIN &&
      pagePermission !== PagePermission.PA
    ) {
      return null;
    }

    return (
      <Select size="small" value={selectedView} onChange={handleRoleChange}>
        <MenuItem value={PagePermission.BOOKING}>
          {PagePermission.BOOKING}
        </MenuItem>
        <MenuItem value={PagePermission.PA}>{PagePermission.PA}</MenuItem>
        {pagePermission === PagePermission.ADMIN && (
          <MenuItem value={PagePermission.ADMIN}>
            {PagePermission.ADMIN}
          </MenuItem>
        )}
      </Select>
    );
  }, [pagePermission, selectedView]);

  return (
    <Nav>
      <Box flex={1}>
        <Title as="h1" onClick={handleClickHome}>
          Media Commons Production
        </Title>
      </Box>
      <Box display="flex" alignItems="center">
        {dropdown}
        <Divider />
        <p>{netId}</p>
      </Box>
    </Nav>
  );
}
// <Navbar expand="md" className="bg-body-tertiary z-10">
//   <Container fluid>
//     <Navbar.Brand>
//       <NavLink to="/">
//
//       </NavLink>
//     </Navbar.Brand>
//     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//     <Navbar.Collapse id="basic-navbar-nav">
//       <Nav className="ms-auto">
//         <Nav.Item>
//           <NavLink
//             className="nav-link"
//             activeClassName="active"
//             to="/my-bookings"
//           >
//             My Bookings
//           </NavLink>
//         </Nav.Item>
//         {pagePermission === PagePermission.ADMIN && (
//
//       </Nav>
//     </Navbar.Collapse>
//   </Container>
// </Navbar>
