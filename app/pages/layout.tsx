import Background from "@/app/ui/home/Background";
import { dm_sans, dm_mono } from "../ui/fonts";
import Sidebar from "@/app/ui/recipes/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${dm_sans} ${dm_mono} overflow-hidden`}>{children}
      <Background>
        <div className="absolute flex h-screen flex-col">
          <div className="w-full h-full flex-none">
            <Sidebar />
          </div>
        </div>
      </Background>
    </div>
  );
}
