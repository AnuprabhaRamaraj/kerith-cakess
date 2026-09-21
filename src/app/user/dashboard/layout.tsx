import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal & Menu Controller | கேரித் Cakes",
  description: "Private administrative management portal for கேரித் Cakes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
