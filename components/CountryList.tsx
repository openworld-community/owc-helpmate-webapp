import { useEffect, useState } from 'react';
import { supabase } from '../lib/initSupabase';

import '../styles/CountryList.module.css';

export default function CountryList() {
  const [countries, setCountries] = useState<{ [x: string]: any }[] | null>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const { data: countries } = await supabase.from('countries').select('*').order('name', { ascending: true });

    if (countries) {
      setCountries(countries);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header">
        <p>Telegram</p>
      </div>

      <div className="container">
        {loading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="sidebar">
            {countries &&
              countries.map((country) => (
                <div className="profile-container" key={country.id}>
                  <div className="profile">
                    <div className="profile-image-container">
                      <div className="profile-image"></div>
                    </div>

                    <div className="profile-message">
                      <p>{country.name}</p>
                    </div>

                    <div className="profile-date">
                      <p>{country.name}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="main">
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    </>
  );
}
