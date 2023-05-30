import { useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from 'react';
import { InputLabel, MenuItem, FormControl, Select, Button, TextField } from '@mui/material';
//import { supabase } from '../lib/initSupabase';
import { MainButton } from '../components/MainButton';

const selectStyle = {
  paddingLeft: '10px',
  paddingRight: '10px',
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (webApp) {
      fetchCountries();
      webApp.ready();
    }
  }, []);

  const fetchCities = async (country: string) => {
    const countryId = countries?.find((c) => c.name === country)?.id;
    const { data: regionIds } = { data: [0, 1] }//await supabase.from('region').select('id').eq('country_id', countryId);
    const cities:
      | {
        [x: string]: any;
      }[]
      | null = [];

    if (regionIds) {
      for (const region of regionIds) {
        const { data: regionCities } = { data: [{ name: 'Tbilisi', id: 0 }, { name: 'Batumi', id: 1 }] }/*await supabase
          .from('city')
          .select('*')
          .eq('region_id', region.id)
          .order('name', { ascending: true });*/
        if (regionCities) cities?.push(...regionCities);
      }
    }

    if (cities) {
      setCities(cities);
    }
  };

  const fetchCountries = async () => {
    const { data: countries } = { data: [{ name: 'Georgia', id: 0 }, { name: 'Russia', id: 1 }] }//await supabase.from('country').select('*').order('name', { ascending: true });

    if (countries) {
      setCountries(countries);
      setLoading(false);
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
        className="login-form__control"
        fullWidth
        style={{
          marginBottom: '20px',
        }}
      >
        <TextField
          id="country"
          label="Страна"
          variant="standard"
          value={country}
          onChange={(e) => {
            fetchCities(e.target.value);
            setCountry(e.target.value);
          }}
          select
          SelectProps={{
            MenuProps: {
              style: { maxHeight: 'calc(100% - 34px)' },
              sx: selectStyle
            }
          }}
          fullWidth
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
          className="login-form__control"
          fullWidth
          style={{
            marginBottom: '20px',
          }}
        >
          <TextField
            id="city"
            label="Город"
            variant="standard"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            select
            SelectProps={{
              MenuProps: {
                style: { maxHeight: 'calc(100% - 102px)' },
                sx: selectStyle
              }
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
