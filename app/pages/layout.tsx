import { dm_sans, dm_mono } from "../ui/fonts";
import Sidebar from "@/app/ui/pages/Sidebar";
import AddRecipe from "../ui/recipes/AddRecipe";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${dm_sans} ${dm_mono} overflow-hidden`}>
      <div id="pagesLayoutContainer" className="absolute grid grid-rows-12 grid-cols-12 gap-6 h-screen w-screen">
        <div className="row-start-1 row-end-13 col-start-1 col-end-4">
          <Sidebar />
        </div>

        <div id="scrollableContainer" className="pt-4 row-start-1 row-end-13 col-start-4 col-end-12">
          {children}
        </div>
      </div>
    </div>
  );
}
