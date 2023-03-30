"use client";

import Link from "next/link";

import Auth from "src/components/Auth";
import { useAuth, VIEWS } from "src/components/AuthProvider";
import SignOut from "src/components/SignOut";

export default function Home() {
  const { initial, user, view } = useAuth();

  if (initial) {
    return <h3>Loading...</h3>;
  }

  if (view === VIEWS.UPDATE_PASSWORD) {
    return <Auth view={view} />;
  }

  if (user) {
    return (
      // Landing page for authenticated users
      <div className="flex flex-row">
        <div className="card">
          <h2>Welcome!</h2>
          <p>
            You are signed in as <strong>{user.email}</strong>
          </p>
          <SignOut />
        </div>
        <div className="card">
          <Link href="/order/supply" className="button">
            OrderSupply
          </Link>
          <Link href="/order/history" className="button">
            OrderHistory
          </Link>
        </div>
      </div>
    );
  }

  return <Auth view={view} />;
}
