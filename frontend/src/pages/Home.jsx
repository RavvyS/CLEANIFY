import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to CLEANIFY
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Sustainable Waste Management Solution
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/register")}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
