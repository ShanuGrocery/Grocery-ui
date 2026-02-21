import React, { useState } from "react";
import { Menu, MenuItem, Box, Divider, Typography, Avatar } from "@mui/material";
import { MdEdit, MdKey, MdOutlineLogout } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai"; // Edit icon
import { Link } from "react-router-dom";

// ProfileMenu Component
const ProfileMenu = ({ user, logout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Call logout method from AuthContext
    handleMenuClose();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* Profile Avatar and Menu Trigger */}
      <Box sx={{ position: "relative" }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "#1D4ED8",
            cursor: "pointer",
            fontSize: 32, // Adjust size of the text inside Avatar
          }}
          onClick={handleMenuOpen}
        >
          {user?.userName?.charAt(0)?.toUpperCase() || "G"}
        </Avatar>

        {/* Edit Icon positioned at the bottom right of Avatar */}
        <AiOutlineEdit
          size={32}
          className="absolute bottom-[-8px] right-[-8px] border-2 p-1 rounded-full bg-black text-white cursor-pointer"
          onClick={handleMenuOpen}
        />
      </Box>

      {/* Profile Information and Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "profile-menu-button",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 220,
            background: "#f9fafb", // Light background
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box sx={{ textAlign: "center", padding: 2 }}>
          {/* Profile Name, Email, and Phone Number */}
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1D4ED8" }}>
            {user?.userName || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {user?.email || "Email not available"}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            +91 9876543210 {/* Placeholder phone */}
          </Typography>
        </Box>

        <Divider sx={{ margin: "8px 0" }} />

        {/* Menu Links */}
        <MenuItem onClick={handleMenuClose}>
          <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
            <MdEdit size={20} style={{ marginRight: 10 }} />
            Edit Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Link to="/change-password" style={{ textDecoration: "none", color: "black" }}>
            <MdKey size={20} style={{ marginRight: 10 }} />
            Change Password
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <MdOutlineLogout size={20} style={{ marginRight: 10 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
