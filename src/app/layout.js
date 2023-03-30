import Image from "next/image";
import Link from "next/link";
import { AuthProvider } from "src/components/AuthProvider";
import createClient from "src/lib/supabase-server";
import "src/styles/globals.css";

// do not cache this layout
export const revalidate = 0;

export const metadata = {
  title: "Next.js with Supabase Auth",
  icons: {
    favicon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body>
        <main className="grid w-full grid-flow-col dark:bg-gray-600">
          <aside
            id="default-sidebar"
            className="fix left-0 w-64 -translate-x-full transition-transform sm:translate-x-0"
            aria-label="Sidebar"
          >
            <div className="h-full overflow-y-auto bg-gray-50 px-3 dark:bg-gray-800">
              <Link href="/" className="mb-5 flex items-center">
                <Image src="/logo.jpg" width={300} height={300} alt="Flowbite Logo" />
              </Link>
              <ul className="space-y-2 font-medium">
                {[
                  {
                    name: "발주 품목",
                    href: "/order/supply",
                  },
                  {
                    name: "발주 내역",
                    href: "/order/history",
                  },
                  {
                    name: "프로필",
                    href: "/profile",
                  },
                ].map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="flex items-center ">
            <div className="px-4 py-4">
              <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
