import { TelegramProvider } from '../contexts/TelegramProvider';
import React, { useState, useEffect } from "react";
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Button,
} from "@mui/material";
import { supabase } from '../lib/initSupabase';

const Login = ({ user }: {
    user: string
}) => {
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")

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
            <form autoComplete="off" onSubmit={handleSubmit}>
                <FormControl fullWidth>
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
                <FormControl fullWidth>
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
                <Button variant="outlined" color="secondary" type="submit">Стать помощником</Button>

            </form>
        </TelegramProvider>
    );
};

export default Login;