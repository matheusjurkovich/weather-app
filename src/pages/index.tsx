import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  Alert,
  Snackbar,
  Link,
} from "@mui/material";
import React from "react";
import { useState } from "react";
const apiKey = process.env.API_KEY;
interface WeatherData {
  name: string;
  weather: [
    {
      description: string;
    }
  ];
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/matheusjurkovich">
        GitHub
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Home() {
  const [inputCity, setInputCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    name: "",
    weather: [
      {
        description: "",
      },
    ],
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      humidity: 0,
      pressure: 0,
    },
    wind: {
      speed: 0,
    },
  });
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const handleSuccess = () => {
    setOpenSuccess(true);
  };
  const handleError = () => {
    setOpenError(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccess(false);
    setOpenError(false);
  };

  const handleGetWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&lang=pt_br&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        handleSuccess();
        setWeatherData(data);
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-sky-bg bg-no-repeat bg-cover">
      <Box
        sx={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          backgroundColor: "white",
          boxShadow: 2,
          gap: 2,
          padding: 6,
        }}
      >
        <Typography variant="h3" fontWeight={700} component="h1">
          Weather App
        </Typography>
        <TextField
          label="Nome da cidade, Ex: São Paulo"
          variant="filled"
          color="primary"
          fullWidth
          onChange={(e) => setInputCity(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleGetWeather();
            }
          }}
        />
        <Button
          onClick={handleGetWeather}
          variant="contained"
          size="large"
          color="primary"
        >
          Get Weather
        </Button>
        {weatherData.name && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: 2,
              gap: 2,
              padding: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" fontWeight={700} component="h2">
                {weatherData.name}
              </Typography>
              <Typography variant="h6" component="h3">
                {weatherData.weather?.[0].description.charAt(0).toUpperCase() +
                  weatherData.weather?.[0].description.slice(1)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography variant="h6" component="h3">
                Temperatura: {weatherData.main?.temp}°C
              </Typography>
              <Typography variant="h6" component="h3">
                Temperatura máxima: {weatherData.main?.temp_max}°C
              </Typography>
              <Typography variant="h6" component="h3">
                Temperatura miníma: {weatherData.main?.temp_min}°C
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography variant="h6" component="h3">
                Umidade: {weatherData.main?.humidity}%
              </Typography>
              <Typography variant="h6" component="h3">
                Pressão: {weatherData.main?.pressure}hPa
              </Typography>
              <Typography variant="h6" component="h3">
                Ventos: {weatherData.wind?.speed}km/h
              </Typography>
            </Stack>
            <Snackbar
              open={openSuccess}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                Sucesso ao pesquisar cidade!
              </Alert>
            </Snackbar>
            <Snackbar
              open={openError}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Erro ao pesquisa cidade!
              </Alert>
            </Snackbar>
          </Box>
        )}
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </main>
  );
}
