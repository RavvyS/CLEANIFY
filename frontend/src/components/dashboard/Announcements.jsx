import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Campaign as CampaignIcon } from "@mui/icons-material";

const Announcements = ({ announcements }) => {
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Announcements
      </Typography>
      <List>
        {announcements.map((announcement, index) => (
          <React.Fragment key={announcement._id}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <CampaignIcon />
              </ListItemIcon>
              <ListItemText
                primary={announcement.title}
                secondary={announcement.content}
              />
            </ListItem>
            {index < announcements.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

export default Announcements;
