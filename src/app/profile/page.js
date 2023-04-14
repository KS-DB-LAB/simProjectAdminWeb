import Link from "next/link";
import { redirect } from "next/navigation";

import SignOut from "src/components/SignOut";
import createClient from "src/lib/supabase-server";

export default async function Profile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen items-center justify-center justify-items-center">
      <div className="card">
        <h2>회원정보</h2>
        <code className="highlight">{user.email}</code>
        <div className="heading">Last Signed In:</div>
        <code className="highlight">{new Date(user.last_sign_in_at).toUTCString()}</code>
        <div className="heading">계좌번호:</div>
        <code className="highlight">
          {user?.user_metadata?.bank + " " + user?.user_metadata?.account_number}
        </code>
        <div className="heading">Brands:</div>
        <div className="highlight">
          {user?.user_metadata?.brands?.map((brand, idx) => (
            <div key={idx}>{brand}</div>
          ))}
        </div>
        <Link className="button" href="/">
          Go Home
        </Link>
        <Link className="button" href="/profile/edit">
          Edit Profile
        </Link>
        <SignOut />
      </div>
    </div>
  );
}
