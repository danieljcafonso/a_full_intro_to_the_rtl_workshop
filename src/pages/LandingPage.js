import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CustomButton from "../components/CustomButton";

export const LandingPage = () => (
  <Box sx={{ height: "90%", overflow: "hidden" }}>
    <Grid container sx={{ height: "90%" }}>
      <Grid xs={2}></Grid>
      <Grid
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        xs={4}
      >
        <Typography variant="h2">
          A Full Intro to the React Testing Library
        </Typography>
        <CustomButton sx={{ marginTop: "2rem" }}>
          Here is a button to query
        </CustomButton>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
        <div>
          <img
            height={200}
            alt="octopus"
            src="https://avatars.githubusercontent.com/u/49996085?s=200&v=4"
          />
          <img
            height={200}
            alt="goat"
            src="https://raw.githubusercontent.com/testing-library/react-testing-library/main/other/goat.png"
          />
        </div>
      </Grid>
      <Grid xs={1}></Grid>
    </Grid>
  </Box>
);

export default LandingPage;
