import { useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Button, TextField } from '@mui/material';
import { supabase } from '../lib/initSupabase';
import { MainButton } from '../components/MainButton';

const textFieldStyle = {
  color: 'var(--tg-theme-text-color)',
  '&:before': {
    borderColor: 'var(--tg-theme-text-color)',
  },
  '&:hover:not(.Mui-disabled, .Mui-error):before': {
    borderColor: 'var(--tg-theme-text-color)',
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--tg-theme-text-color)',
  },
};

const labelStyle = { color: 'var(--tg-theme-text-color)', opacity: '0.6' };

const Login = () => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const { webApp, user } = useTelegram();

  const handleSubmit = () => {
    // example
    if (webApp) {
      webApp.close();
    }
  };

  const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);
  const [cities, setCities] = useState<{ [x: string]: any }[] | null>([]);

  useEffect(() => {
    if (webApp) {
      fetchCountries();
      webApp.ready();
    }
  }, []);

  const fetchCities = async (country: string) => {
    const countryId = countries?.find((c) => c.name === country)?.id;
    const { data: cities } = await supabase
      .from('cities')
      .select('*')
      .eq('country', countryId)
      .order('name', { ascending: true });

    if (cities) {
      setCities(cities);
    }
  };

  const fetchCountries = async () => {
    const { data: countries } = await supabase.from('countries').select('*').order('name', { ascending: true });

    if (countries) {
      setCountries(countries);
    }
  };

  // Show the user. No loading state is required
  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '16px auto',
      }}
    >
      <FormControl
        fullWidth
        style={{
          marginBottom: '20px',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <TextField
          select
          id="country"
          label="Страна"
          variant="standard"
          value={country}
          onChange={(e) => {
            fetchCities(e.target.value);
            setCountry(e.target.value);
          }}
          InputLabelProps={{ sx: labelStyle }}
          SelectProps={{
            sx: textFieldStyle,
            MenuProps: {
              style: { top: '16px', maxHeight: 'calc(100% - 34px)' },
            },
          }}
        >
          {countries &&
            countries.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
        </TextField>
      </FormControl>
      {country ? (
        <FormControl
          fullWidth
          style={{
            marginBottom: '20px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          <TextField
            select
            id="city"
            label="Город"
            variant="standard"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            SelectProps={{
              sx: textFieldStyle,
              MenuProps: {
                style: { top: '16px', maxHeight: 'calc(100% - 102px)' },
              },
            }}
          >
            {cities &&
              cities.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                );
              })}
          </TextField>
        </FormControl>
      ) : null}
      {user ? (
        <MainButton text="Стать помощником" onClick={handleSubmit}></MainButton>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          type="submit"
          fullWidth
          style={{
            background: 'var(--button-color)',
            color: 'var(--button-text-color)',
            marginTop: '20px',
            border: 'none',
          }}
        >
          Стать помощником
        </Button>
      )}
    </form>
  );
};

export default Login;
