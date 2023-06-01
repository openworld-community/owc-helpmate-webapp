import { useTelegram } from '../contexts/TelegramProvider';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { supabase } from '../lib/initSupabase';

const Role = () => {
  const { user, webApp } = useTelegram();
  const { push, query } = useRouter();
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', query.user);

    if (profile) {
      console.log(profile[0]);
      setProfile(profile[0]);
    } else {
      // insert user to table if no profile
      const { data } = await supabase.from('profiles').insert({ id: 1234 }).select();

      if (data) {
        setProfile(data);
      }
    }
  };

  const onClientClick = () => {
    push({
      pathname: '/client_login',
      query: {
        user: query.user,
        profile: profile?.id,
      },
    });

    return {
      redirect: {
        destination: '/client_login',
        query: {
          user: query.user,
          profile: profile?.id,
        },
        permanent: false,
      },
    };
  };

  const onHelperClick = () => {
    push({
      pathname: '/helper_login',
      query: { user: query.user, profile: profile?.id },
    });
    return {
      redirect: {
        destination: '/helper_login',
        query: {
          user: query.user,
          profile: profile?.id,
        },
        permanent: false,
      },
    };
  };

  useEffect(() => {
    if (webApp) {
      fetchProfile();
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
      <h1>Кто вы?</h1>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onClientClick}
        fullWidth
        style={{
          background: 'var(--button-color)',
          color: 'var(--button-text-color)',
          marginTop: '20px',
          border: 'none',
        }}
      >
        Клиент
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onHelperClick}
        fullWidth
        style={{
          background: 'var(--button-color)',
          color: 'var(--button-text-color)',
          marginTop: '20px',
          border: 'none',
        }}
      >
        Помощник
      </Button>
    </div>
  );
};

export default Role;
