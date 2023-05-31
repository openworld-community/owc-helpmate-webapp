import { GetServerSidePropsContext } from 'next';
import { supabase } from '../lib/initSupabase';

export const getServerSideProps = async function (context: GetServerSidePropsContext) {
  const telegramUserId = context.query.user;
  const role = context.query.role;

  const { data: userProfile, error } = await supabase.from('profiles').select('*').eq('id', telegramUserId).maybeSingle();

  if (userProfile) {

  }

  return {
    props: { role },
  };
};

const Profile = ({ role }: { role: string }) => {
  // Show the user. No loading state is required
  if (role === 'helper')
    return <p>Спасибо, что стали помощником!</p>;
};

export default Profile;
