"use client";
import { useEffect, useState } from "react";
import { Wind, Cloud, Droplet, Eye } from "lucide-react";
import Image from 'next/image';
import moment from "moment";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface Weather {
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  name: string;
}

interface HourlyForecast {
  dt: number;
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
  };
}

interface DailyForecast {
  dt: number;
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  dt_txt: string;
}

interface MainProps {
  latitude?: number;
  longitude?: number;
  query?: string | null;
}

export default function Main({ latitude, longitude, query }: MainProps) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);

  async function getWeather() {
    let url = `https://api.openweathermap.org/data/2.5/weather?`;
    if (query) {
      url += `q=${query}&`;
    } else {
      url += `lat=${latitude}&lon=${longitude}&`;
    }
    url += `appid=${API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    const data = await response.json();
    setWeather(data);
  }

  async function getForecast() {
    let url = `https://api.openweathermap.org/data/2.5/forecast?`;
    if (query) {
      url += `q=${query}&`;
    } else {
      url += `lat=${latitude}&lon=${longitude}&`;
    }
    url += `appid=${API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    const data = await response.json();

    const hourlyForecastFiltered = data.list.filter(
      (forecast: any, index: number) => {
        return index < 6;
      }
    );
    const dailyForecastFiltered = data.list.filter(
      (forecast: any, index: number) => {
        return index % 8 === 0;
      }
    );
    setDailyForecast(dailyForecastFiltered);
    setHourlyForecast(hourlyForecastFiltered);
  }

  useEffect(() => {
    getWeather();
    getForecast();
  }, []);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  const formattedTime = `${
    currentHour < 10 ? "0" + currentHour : currentHour
  }:${currentMinute < 10 ? "0" + currentMinute : currentMinute}`;

  return (
    <main className="flex flex-col items-center  gap-16">
      <section className="flex items-center justify-center h-1/2 gap-10 w-full max-xl:flex-col">
        <div className="bg-slate-800 text-gray-100 rounded-xl flex w-1/3  flex-col gap-4 p-6 max-xl:w-full">
          <div className="flex justify-between items-center">
            <p className="text-5xl font-bold">{weather?.main.temp}ºC</p>
            <div className="w-36">
              <p className="text-2xl text-end">{weather?.name}</p>
              <p className="text-end">{formattedTime}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {weather?.weather[0]?.icon && (
                <Image
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather icon"
                  width={48}
                  height={48}
                />
              )}
              {weather?.weather[0]?.description && (
                <p>
                  {weather.weather[0].description.charAt(0).toUpperCase() +
                    weather.weather[0].description.slice(1)}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Wind />
              <p>{weather?.wind.speed} m/s</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p>Fell like: {weather?.main.feels_like}ºC</p>
            <p>
              {weather?.main.temp_min}ºC to {weather?.main.temp_max}ºC
            </p>
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-4">
          {hourlyForecast &&
            hourlyForecast.map((forecast, index) => (
              <div
                key={index}
                className=" bg-slate-800 text-gray-100 rounded-xl shadow-md"
              >
                <div className="bg-slate-800 text-gray-100 rounded-xl flex flex-col justify-between py-2 px-4 items-center w-32 h-60">
                  <p>
                    {new Date(forecast.dt * 1000).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="flex flex-col items-center gap-1">
                    {forecast.weather[0]?.icon && (
                      <Image
                      src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                      alt="Weather icon"
                      width={48}
                      height={48}
                    />
                    )}
                    {forecast.weather[0]?.description && (
                      <p className="text-center">
                        {forecast.weather[0].description
                          .charAt(0)
                          .toUpperCase() +
                          forecast.weather[0].description.slice(1)}
                      </p>
                    )}
                  </div>
                  <p className="text-2xl">{forecast.main.temp}º</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center h-1/2 gap-4 w-full">
        <h1 className="text-xl font-bold">5 days forecast</h1>
        <div className="w-[800px] gap-2 flex flex-col max-lg:w-1/2 flex-wrap">
          {dailyForecast &&
            dailyForecast.map((forecast, index) => (
              <div
                key={index}
                className="flex items-center w-full justify-between shadow-md bg-slate-800 text-gray-100 rounded-xl gap-4 p-6 max-lg:flex-col"
              >
                <p className="text-lg font-bold">
                  {moment(forecast?.dt_txt).format(`dddd`)}
                </p>
                <hr className="h-full w-1 border-white bg-white" />

                <div className="flex flex-col items-center">
                <Image
                  src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                  alt="Weather icon"
                  width={48}
                  height={48}
                />
                  <div>
                    {forecast?.weather[0]?.description && (
                      <p>
                        {forecast.weather[0].description
                          .charAt(0)
                          .toUpperCase() +
                          forecast.weather[0].description.slice(1)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p>min: {forecast?.main.temp_min}</p>
                  <p>max: {forecast?.main.temp_max}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Droplet /> <p>{forecast?.main.humidity}%</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Cloud /> <p>{forecast?.clouds.all}%</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Eye /> <p>{forecast?.visibility}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
