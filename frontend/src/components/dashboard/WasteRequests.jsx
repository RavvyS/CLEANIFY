import React from "react";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  Recycling as RecyclingIcon,
} from "@mui/icons-material";

const WasteRequests = ({ requests, setShowRequestForm }) => {
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        My Waste Requests
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={() => setShowRequestForm(true)}
          startIcon={<AddIcon />}
        >
          New Request
        </Button>
      </Typography>
      <List>
        {requests.map((request) => (
          <ListItem key={request._id}>
            <ListItemIcon>
              <RecyclingIcon />
            </ListItemIcon>
            <ListItemText
              primary={`Zone: ${request.zone} - Waste Type: ${request.wasteType}`}
              secondary={`Status: ${request.status} | Pickup Date: ${new Date(
                request.pickupDate
              ).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default WasteRequests;
