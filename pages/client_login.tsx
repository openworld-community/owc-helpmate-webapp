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
  const [request, setRequest] = useState('');
  const [sent, setSent] = useState(false);

  const { webApp, user } = useTelegram();

  const handleSubmit = () => {
    setSent(true);
  };

  const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);
  const [cities, setCities] = useState<{ [x: string]: any }[] | null>([]);

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      fetchCountries();
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

  if (sent) {
    return (
      <div
        style={{
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          margin: '16px auto',
        }}
      >
        Мы уже ищем помощника для вашей заявки и скоро вернемся с обратной связью.
      </div>
    );
  }

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
            InputLabelProps={{ sx: labelStyle }}
            SelectProps={{
              sx: textFieldStyle,
              MenuProps: {
                style: { top: '16px', maxHeight: 'calc(100% - 34px)' },
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
      {city ? (
        <FormControl
          fullWidth
          style={{
            marginBottom: '20px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          <TextField
            id="request"
            label="Заявка"
            InputLabelProps={{
              sx: labelStyle,
              shrink: true,
            }}
            variant="standard"
            defaultValue="Опишите ваш запрос или проблему"
            value={request}
            multiline
            onChange={(e) => setRequest(e.target.value)}
          />
        </FormControl>
      ) : null}
      {user ? (
        <MainButton text="Отправить заявку" onClick={handleSubmit}></MainButton>
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
          Отправить заявку
        </Button>
      )}
    </form>
  );
};

export default Login;
