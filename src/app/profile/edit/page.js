import UpdateUserData from "@/components/Auth/UpdateUserData";
import Link from "next/link";
import { redirect } from "next/navigation";

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
        <h2>회원정보 변경하기</h2>
        <code className="highlight">{user.email}</code>
        <UpdateUserData />
        <Link className="button" href="/">
          Go Home
        </Link>
      </div>
    </div>
  );
}
