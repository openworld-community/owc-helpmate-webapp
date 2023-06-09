import { useRouter } from 'next/router';
import { useTelegram } from '../contexts/TelegramProvider';
import { Button } from '@mui/material';
import { supabase } from '../lib/initSupabase';
import { MainButton } from '../components/MainButton';

const Profile = () => {
  const { user } = useTelegram();
  const { push } = useRouter();

  const handleClick = async () => {
    await supabase.from('helpers').delete().eq('id', user?.id).select();
    await supabase.from('profiles').update({role: 'user'}).eq('id', user?.id);

    push({
      pathname: '/',
    });

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  };

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
      <p>Спасибо, что стали помощником!</p>
      {user ? (
        <MainButton text="Перестать помогать" onClick={handleClick}></MainButton>
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
          onClick={handleClick}
        >
          Перестать помогать
        </Button>
      )}
    </div>
  );
};

export default Profile;
