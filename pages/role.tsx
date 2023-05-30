import { useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from 'react';
import { InputLabel, MenuItem, FormControl, Select, Button } from '@mui/material';
import { MainButton } from '../components/MainButton';
import { Router, useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

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

export const getServerSideProps = async function (context: GetServerSidePropsContext) {
    const telegramUserId = context.query.user;

    return {
        props: { telegramUserId },
    };
};

const Role = ({ telegramUserId }: { telegramUserId: string }) => {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    const { webApp, user } = useTelegram();
    const { push } = useRouter();

    const onClientClick = () => {
        push('/client_login')

        return {
            redirect: {
                destination: '/client_login',
                query: {
                    user: telegramUserId,
                },
                permanent: false,
            },
        };
    };

    const onHelperClick = () => {
        push('/helper_login')
        return {
            redirect: {
                destination: '/helper_login',
                query: {
                    user: telegramUserId,
                },
                permanent: false,
            },
        };
    };

    // Show the user. No loading state is required
    return (
        <div style={{
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            margin: '16px auto',
        }}>
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
