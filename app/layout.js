import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/server";
import TopNav from "@/components/navigation/TopNav";
import ReactQueryProvider from "@/components/helpers/ReactQueryProvider";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getActiveLog, getActiveLogCount } from "@/lib/actions/logs";
import { getUserProjects } from "@/lib/actions/projects";

const fontMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) console.error(error);

  const queryClient = new QueryClient();

  const logCount = await queryClient.fetchQuery({
    queryKey: ["logs", "active", "count"],
    queryFn: () => getActiveLogCount(),
  });

  if (user) {
    const activeLog = await queryClient.fetchQuery({
      queryKey: ["log", "active"],
      queryFn: () => getActiveLog(),
    });

    const projects = await queryClient.fetchQuery({
      queryKey: ["projects"],
      queryFn: () => getUserProjects(),
    });
  }

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-mono antialiased dark",
          fontMono.variable
        )}
      >
        <ReactQueryProvider>
          {/* <NavWrapper>{children}</NavWrapper> */}

          <div className="flex flex-col min-h-screen">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <TopNav user={user} />
              {children}
            </HydrationBoundary>
          </div>

          <Toaster richColors theme="dark" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
