import { TelegramProvider, useTelegram } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from "react";
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Button,
} from "@mui/material";
import { supabase } from '../lib/initSupabase';
import { MainButton } from '../components/MainButton';

const Login = ({ user }: {
    user: string
}) => {
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")

    const { webApp } = useTelegram();
console.log(webApp);
    const handleSubmit = () => {
        // TODO
    }

    const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);
    const [cities, setCities] = useState<{ [x: string]: any }[] | null>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCities = async (country: string) => {
        const countryId = countries?.find((c) => c.name === country)?.id;
        const { data: regionIds } = await supabase.from('region').select('id').eq('country_id', countryId);
        const cities: {
            [x: string]: any;
        }[] | null = [];

        if (regionIds) {
            for (const region of regionIds) {
                const { data: regionCities } = await supabase.from('city').select('*').eq('region_id', region.id).order('name', { ascending: true });
                console.log(regionCities);
                if (regionCities) cities?.push(...regionCities);
            }
        }

        if (cities) {
            setCities(cities);
        }
    }

    const fetchCountries = async () => {
        const { data: countries } = await supabase.from('country').select('*').order('name', { ascending: true });

        if (countries) {
            setCountries(countries);
            setLoading(false);
        }
    };

    // Show the user. No loading state is required
    return (
        <TelegramProvider>
            <form autoComplete="off" onSubmit={handleSubmit}
                style={{ maxWidth: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '16px auto' }}>
                <FormControl className="login-form__control" fullWidth style={{
                    marginBottom: '20px'
                }}>
                    <InputLabel id="country">Страна</InputLabel>
                    <Select
                        id="country"
                        label="Страна"
                        variant="standard"
                        value={country}
                        onChange={e => {
                            fetchCities(e.target.value);
                            setCountry(e.target.value);
                        }}
                    >
                        {countries &&
                            countries.map((item) => (
                                <MenuItem key={item.id} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl className="login-form__control" fullWidth>
                    <InputLabel id="city">Город</InputLabel>
                    <Select
                        id="city"
                        label="Город"
                        variant="standard"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    >
                        {cities &&
                            cities.map((item) => {
                                return (
                                    <MenuItem key={item.id} value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                )
                            })}
                    </Select>
                </FormControl>
                {webApp ? <MainButton text="Стать помощником" onClick={handleSubmit}></MainButton>:
                 <Button variant="outlined" color="secondary" type="submit" fullWidth
                    style={{
                        background: 'var(--tg-theme-button-color)',
                        color: 'var(--tg-theme-button-text-color)',
                        marginTop: '20px',
                        border: 'none'
                    }}>Стать помощником</Button>}
            </form>
        </TelegramProvider>
    );
};

export default Login;