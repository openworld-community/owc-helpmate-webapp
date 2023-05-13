import { GetServerSidePropsContext } from 'next';
import { TelegramProvider } from '../contexts/TelegramProvider';
 export const getServerSideProps = async function (context: GetServerSidePropsContext) {
  const telegramUserId = context.query.user;
  const { user } = {
    user: undefined
  }; // TODO: Fetch user from the database/check if registered
 
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        query: {
          user: telegramUserId
        },
        permanent: false,
      },
    };
  }
 
  return {
    props: { user },
  };
};
 
const Profile = ({ user }: {
  user: string
}) => {
  // Show the user. No loading state is required
  return (
    <TelegramProvider>
      <p>Спасибо {user}, что стали помощником!</p>
    </TelegramProvider>
  );
};
 
export default Profile;