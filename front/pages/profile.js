import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";

const Profile = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile | Nodebird</title>
      </Head>
      <AppLayout>
        <div>profile</div>
      </AppLayout>
    </>
  );
};

export default Profile;
