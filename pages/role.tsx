import { useTelegram } from '../contexts/TelegramProvider';
import React from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { supabase } from '../lib/initSupabase';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async function (context: GetServerSidePropsContext) {
  const telegramUserId = context.query.user;

  const { data: userProfile, error } = await supabase.from('profiles').select('*').eq('id', telegramUserId).maybeSingle();

  console.log(userProfile, error);
  return {
    props: { telegramUserId, userProfile },
  };
};

const Role = ({ telegramUserId, userProfile }: { telegramUserId: string, userProfile: any }) => {
  const { webApp, user } = useTelegram();
  const { push } = useRouter();

  const onClientClick = () => {
    push('/client_login');

    return {
      redirect: {
        destination: '/client_login',
        query: {
          user: telegramUserId,
          profile: userProfile
        },
        permanent: false,
      },
    };
  };

  const onHelperClick = () => {
    push('/helper_login');
    return {
      redirect: {
        destination: '/helper_login',
        query: {
          user: telegramUserId,
          profile: userProfile
        },
        permanent: false,
      },
    };
  };

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
