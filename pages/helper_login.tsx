import { useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Button, TextField, containerClasses } from '@mui/material';
import { supabase } from '../lib/initSupabase';
import { MainButton } from '../components/MainButton';
import { GetServerSidePropsContext } from 'next';

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

export const getServerSideProps = async function (context: GetServerSidePropsContext) {
  const telegramUserId = context.query.user;
  const profile = context.query.profile as any;

  return {
    props: { telegramUserId, profile },
  };
};

const Login = ({ telegramUserId, profile }: { telegramUserId: string, profile: any }) => {
  const [helper, setHelperProfile] = useState<any>(null);
  const [country, setCountry] = useState(helper?.countryId || '');
  const [city, setCity] = useState(helper?.cityId || '');
  const [chat, setChat] = useState<any>(null);
  const { webApp, user } = useTelegram();

  console.log(telegramUserId, helper);
  const handleSubmit = async () => {
    // insert user to table if no profile
    if (!profile) {
      const { data, error } = await supabase.from('profiles').insert([
        { ...user, country_id: country, city_id: city }
      ]).select().maybeSingle();
      if (data) {
        const helper = await supabase.from('helpers').insert([
          { id: data.id, chat: chat.id }
        ])
      }
    } else {
      await supabase.from('helpers').upsert([
        { id: helper.id, country_id: country, city_id: city }
      ])
    }
    // example
    if (webApp) {
      webApp.close();
    }
  };

  const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);
  const [cities, setCities] = useState<{ [x: string]: any }[] | null>([]);

  useEffect(() => {
    console.log(telegramUserId, profile)
    fetchHelperProfile();
    fetchCountries();
    if (webApp) {
      webApp.ready();
    }
  }, [webApp]);

  const fetchHelperProfile = async () => {
    const { data: helper, error } = await supabase.from('helpers').select('*').eq('id', profile).maybeSingle();
    if (helper) {
      console.log('helper', helper);
      setHelperProfile(helper);
      setCountry(helper.country_id);
      setCity(helper.city_id);
    }
  }

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
      setChat(chats[0])
    }
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
            console.log(e);
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
              console.log(e);
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
      {city && chat ? (
        <p>Для успешной регистрации вступите в чат по ссылке: {chat.invite}</p>
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
