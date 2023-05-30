import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async function (context: GetServerSidePropsContext) {
  const telegramUserId = context.query.user;
  const { user } = {
    user: undefined,
  }; // TODO: Fetch user from the database/check if registered

  if (!user) {
    return {
      redirect: {
        destination: `/role?user=${telegramUserId}`,
        query: {
          user: telegramUserId,
        },
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

const Profile = ({ user }: { user: string }) => {
  // Show the user. No loading state is required
  return <p>Спасибо {user}, что стали помощником!</p>;
};

export default Profile;
