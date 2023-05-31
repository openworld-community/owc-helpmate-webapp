import { useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Button, TextField } from '@mui/material';
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
    const [client, setClient] = useState<any>(null);
    const [country, setCountry] = useState(client?.countryId || '');
    const [city, setCity] = useState(client?.cityId || '');
    const [request, setRequest] = useState('');
    const [sent, setSent] = useState(false);
    const [chat, setChat] = useState<any>(null);

    const { webApp, user } = useTelegram();

    async function handleSubmit() {
        console.log(request, country, city);
        // insert user to table if no profile
        if (!profile) {
            const { data, error } = await supabase.from('profiles').insert([
                { ...user, country_id: country, city_id: city }
            ]).select().maybeSingle();
            if (data) {
                profile = data.id
            }
        }

        // create task
        const task = await supabase.from('tasks').insert([
            { chat: chat?.id, description: request, profile: profile }
        ])
        console.log(task);
        // example
        setSent(true);
    };

    useEffect(() => {
        webApp?.MainButton.onClick(handleSubmit)
      }, [webApp]);

    const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);
    const [cities, setCities] = useState<{ [x: string]: any }[] | null>([]);

    useEffect(() => {
        console.log(telegramUserId, profile)
        fetchCountries();
        if (webApp) {
            webApp.ready();
        }
    }, [webApp]);

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

    console.log(request)
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
                        console.log('set country')
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
                        placeholder="Опишите ваш запрос или проблему"
                        defaultValue={request}
                        multiline
                        onChange={(e) => setRequest(e.target.value)}
                    />
                </FormControl>
            ) : null}
            {city && chat ? (
                <p>Для успешной регистрации вступите в чат по ссылке: {chat.invite}</p>
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
                    onClick={handleSubmit}
                >
                    Отправить заявку
                </Button>
            )}
        </form>
    );
};

export default Login;
