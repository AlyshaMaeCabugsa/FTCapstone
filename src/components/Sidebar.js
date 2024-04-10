import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import InspectionIcon from '@mui/icons-material/Build'; // Or any other appropriate icon
import CertificateIcon from '@mui/icons-material/CardMembership'; // Or any other appropriate icon
import LogoutIcon from '@mui/icons-material/ExitToApp';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EstablishmentIcon from '@mui/icons-material/Business'; // Example icon for establishments
import FsicIcon from '@mui/icons-material/Description'; // Example icon for FSIC Positive/Negative
import Divider from '@mui/material/Divider';


const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: '#021024', // The dark blue color you want
      color: 'white', // Set text color to white
      marginTop: '64px', // The height of your AppBar
      height: `calc(100% - 64px)`, // Subtract the AppBar height from the 100% viewport height
      position: 'fixed', // This will make it fixed during scroll
    },
  }));

  const SidebarItem = styled(ListItem)({
    '&:hover': {
      backgroundColor: '#34495e', // The hover color for your items
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: 'white', // This will apply white color to your icons and text
    },
  });

const Sidebar = () => {
  const [trackingListOpen, setTrackingListOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('loggedIn', 'false');
    window.location.href = '/sign-in';
  };

  return (
    <StyledDrawer variant="permanent">
      <List>
        <SidebarItem component={Link} to="/admin-dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </SidebarItem>
        <SidebarItem onClick={() => setTrackingListOpen(!trackingListOpen)}>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Tracking List" />
          {trackingListOpen ? <ExpandLess /> : <ExpandMore />}
        </SidebarItem>
        <Collapse in={trackingListOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SidebarItem component={Link} to="/establishments">
              <ListItemIcon>
                <EstablishmentIcon />
              </ListItemIcon>
              <ListItemText primary="Establishments" />
            </SidebarItem>
            <SidebarItem component={Link} to="/fsic-positive-negative">
              <ListItemIcon>
                <FsicIcon />
              </ListItemIcon>
              <ListItemText primary="FSIC Positive and Negative" />
            </SidebarItem>
          </List>
        </Collapse>
        <SidebarItem component={Link} to="/reports">
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </SidebarItem>
        <SidebarItem component={Link} to="/inspection">
          <ListItemIcon>
            <InspectionIcon />
          </ListItemIcon>
          <ListItemText primary="Inspection" />
        </SidebarItem>
        <SidebarItem component={Link} to="/certificates">
          <ListItemIcon>
            <CertificateIcon />
          </ListItemIcon>
          <ListItemText primary="Certificates" />
        </SidebarItem>
      </List>
      <Divider style={{ backgroundColor: 'white' }} />
      <List style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <SidebarItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </SidebarItem>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;