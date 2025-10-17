import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const RouteForm = () => {
  const [truck, setTruck] = useState("");
  const [zones, setZones] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRoute = {
        truck,
        zones: zones.split(",").map((zone) => zone.trim()),
        date,
      };
      await axios.post("http://localhost:5000/api/routes", newRoute);

      // Show success message
      toast.success("Route scheduled successfully!");

      // Clear the form fields
      setTruck("");
      setZones("");
      setDate("");
    } catch (err) {
      console.error(err);
      // Show error message
      toast.error("Failed to schedule route.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Truck</InputLabel>
        <Select value={truck} onChange={(e) => setTruck(e.target.value)}>
          <MenuItem value={"Truck A"}>Truck A</MenuItem>
          <MenuItem value={"Truck B"}>Truck B</MenuItem>
          <MenuItem value={"Truck C"}>Truck C</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Zones (comma-separated)"
        fullWidth
        margin="normal"
        value={zones}
        onChange={(e) => setZones(e.target.value)}
      />
      <TextField
        label="Date"
        type="date"
        fullWidth
        margin="normal"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button type="submit" variant="contained" color="primary">
        Save Route
      </Button>
    </form>
  );
};

export default RouteForm;
