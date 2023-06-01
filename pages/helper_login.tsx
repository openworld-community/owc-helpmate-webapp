import { useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Button, TextField } from '@mui/material';
import { supabase } from '../lib/initSupabase';
import { MainButton } from '../components/MainButton';
import { useRouter } from 'next/router';

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
  const { webApp, user } = useTelegram();
  const { push, query } = useRouter();

  const [helper, setHelperProfile] = useState<any>(null);
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [chat, setChat] = useState<any>(null);
  const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);
  const [cities, setCities] = useState<{ [x: string]: any }[] | null>([]);

  const handleSubmit = async () => {
    if (helper) {
      await supabase
        .from('helpers')
        .update({ id: query.profile, chat: chat?.id || 1234 })
        .eq('id', query.profile);
    } else {
      await supabase.from('helpers').insert({ id: query.profile, chat: chat?.id || 1234 });
    }

    push({
      pathname: '/profile',
      query: {
        helper: query.profile,
      },
    });

    return {
      redirect: {
        destination: '/profile',
        query: {
          helper: query.profile,
        },
        permanent: false,
      },
    };
  };

  const fetchHelperProfile = async () => {
    const { data } = await supabase.from('helpers').select('*').eq('id', query.profile);
    return data;
  };

  const fetchCities = async (country: string) => {
    const { data: cities } = await supabase
      .from('cities')
      .select('*')
      .eq('country', country)
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

  const fetchChat = async () => {
    const { data: chats } = await supabase.from('chats').select('*').eq('country', country).eq('city', city);

    if (chats && chats.length) {
      setChat(chats[0]);
    }
  };

  useEffect(() => {
    fetchHelperProfile().then((data) => {
      if (data) {
        push({
          pathname: '/profile',
          query: {
            helper: data[0].id,
          },
        });

        return {
          redirect: {
            destination: '/profile',
            query: {
              helper: data[0].id,
            },
            permanent: false,
          },
        };
      }
    });
    fetchCountries();
    if (webApp) {
      webApp.ready();
    }
  }, []);

  // Show the user. No loading state is required
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
              <MenuItem key={item.id} value={item.id}>
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
            onChange={(e) => {
              setCity(e.target.value);
              fetchChat();
            }}
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
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
          </TextField>
        </FormControl>
      ) : null}
      {city && chat ? <p>Для успешной регистрации вступите в чат по ссылке: {chat.invite}</p> : null}
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
          onClick={handleSubmit}
        >
          Стать помощником
        </Button>
      )}
    </div>
  );
};

export default Login;
