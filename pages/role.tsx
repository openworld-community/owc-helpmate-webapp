import { useTelegram } from '../contexts/TelegramProvider';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { supabase } from '../lib/initSupabase';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async function (context: GetServerSidePropsContext) {
    const telegramUserId = context.query.user;
    
    return {
        props: { telegramUserId },
    };
};

const Role = ({ telegramUserId }: { telegramUserId: string }) => {
    const { webApp, user } = useTelegram();
    const [profile, setProfile] = useState<any>(null)
    const { push } = useRouter();

    
    useEffect(() => {
        if (webApp) {
          fetchProfile();
          webApp.ready();
        }
      }, []);

      
    const fetchProfile = async () => {
        const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', telegramUserId).maybeSingle();
        if (profile) setProfile(profile);
    }

    const onClientClick = () => {
        console.log(telegramUserId, profile);

        push({
            pathname: '/client_login',
            query: {
                user: user?.id,
                profile: profile
            },
        })

        return {
            redirect: {
                destination: '/client_login',
                query: {
                    user: telegramUserId,
                    profile: profile
                },
                permanent: false,
            },
        };
    };

    const onHelperClick = () => {
        console.log(telegramUserId, profile);

        push({
            pathname: '/helper_login',
            query: { user: user?.id, profile: profile },
        })
        return {
            redirect: {
                destination: '/helper_login',
                query: {
                    user: telegramUserId,
                    profile: profile
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
