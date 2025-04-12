import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/auth-slice";
import { 
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon,
  Avatar,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  AccountCircle,
  Logout,
  Email,
  Lock,
  KeyboardArrowDown,
  Menu as MenuIcon
} from "@mui/icons-material";
import UpdatePasswordModal from "./update-password-modal";
import UpdateEmailModal from "./update-email-modal";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  
  const open = Boolean(anchorEl);
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl);
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  
  const handleOpenMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  
  const handleCloseMobileMenu = () => {
    setMobileMenuAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    handleCloseMobileMenu();
  };
  
  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
    handleCloseUserMenu();
    handleCloseMobileMenu();
  };
  
  const handleOpenEmailModal = () => {
    setEmailModalOpen(true);
    handleCloseUserMenu();
    handleCloseMobileMenu();
  };
  
  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Habit Tracker
          </Typography>
          
          {user ? (
            <>
              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleOpenMobileMenu}
                    size="large"
                    edge="end"
                    aria-label="menu"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={mobileMenuOpen}
                    onClose={handleCloseMobileMenu}
                    PaperProps={{
                      elevation: 3,
                      sx: { width: 200, maxWidth: '100%' }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled>
                      <Typography variant="subtitle2">Hello, {user.name}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleOpenEmailModal}>
                      <ListItemIcon>
                        <Email fontSize="small" />
                      </ListItemIcon>
                      Update Email
                    </MenuItem>
                    <MenuItem onClick={handleOpenPasswordModal}>
                      <ListItemIcon>
                        <Lock fontSize="small" />
                      </ListItemIcon>
                      Reset Password
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    color="inherit"
                    onClick={handleOpenUserMenu}
                    endIcon={<KeyboardArrowDown />}
                    startIcon={
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'primary.dark',
                          fontSize: '0.875rem'
                        }}
                      >
                        {user.name?.charAt(0).toUpperCase() || <AccountCircle />}
                      </Avatar>
                    }
                  >
                    {user.name}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      elevation: 3,
                      sx: { width: 220, maxWidth: '100%' }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleOpenEmailModal}>
                      <ListItemIcon>
                        <Email fontSize="small" />
                      </ListItemIcon>
                      Update Email
                    </MenuItem>
                    <MenuItem onClick={handleOpenPasswordModal}>
                      <ListItemIcon>
                        <Lock fontSize="small" />
                      </ListItemIcon>
                      Reset Password
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </>
          ) : (
            <Button color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Modals */}
      <UpdatePasswordModal 
        open={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
      
      <UpdateEmailModal 
        open={emailModalOpen} 
        onClose={() => setEmailModalOpen(false)} 
      />
    </>
  );
};

export default Header;