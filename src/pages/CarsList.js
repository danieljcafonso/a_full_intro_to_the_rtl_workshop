import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CarCard from "../components/CarCard";
import { styled } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import useGetCarsByUser from "../hooks/useGetCarsByUser";

export const StyledGrid = styled(Grid)(
  ({ theme }) => `
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 1rem;
  `
);

const CarList = [
  {
    brand: "Audi",
    model: "Guinea",
    segment: "Van",
    price: 12000,
    fuel: "Diesel",
    photo:
      "https://as2.ftcdn.net/v2/jpg/00/16/14/89/1000_F_16148967_YvRk9vkq8eyVda5pDAeTRCvciG87ucqJ.jpg",
  },
  {
    brand: "Ferrari",
    model: "Hedgehog",
    segment: "Coupe",
    price: 82000,
    fuel: "Electric",
    photo:
      "https://i.pinimg.com/originals/f6/54/cd/f654cd0b1d30e6a75d101bc5603b3c49.jpg",
  },
  {
    brand: "BMW",
    model: "Capybara",
    segment: "Sedan",
    price: 103000,
    fuel: "Hybrid",
    photo:
      "https://external-preview.redd.it/V5bU4RPx7sI6WPvXoYx5P1Y4MXxCnWqXA6r5_MQtO3Q.jpg?auto=webp&s=df7e02a40953745419d4bd7e1ee52cb5f0f81148",
  },
  {
    brand: "Toyota",
    model: "Aleixo",
    segment: "Mono Van",
    price: 99000,
    fuel: "GPL",
    photo:
      "https://ogimg.infoglobo.com.br/in/24204999-a8f-186/FT1500A/690/bruno-aleixo.jpg",
  },
];

export const CarsList = () => {
  const { isLoading, data } = useGetCarsByUser();

  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100% - 5vw) ",
      }}
    >
      <CircularProgress aria-describedby="loader" />
    </Box>
  ) : (
    <Box>
      <Grid container>
        {data.map((car) => (
          <StyledGrid item key={`${car.brand}_${car.model}`} xs={3}>
            <CarCard car={car} />
          </StyledGrid>
        ))}
      </Grid>
    </Box>
  );
};

export default CarsList;
