
// UI Import
import Navbar from "../../ui/home/Navbar";
import RecipeModule from "../../ui/home/RecipeModule";
import ReminderModule from "../../ui/home/ReminderModule";
import CommunityModule from "../../ui/home/CommunityModule";

//UID GRAB
import { fetchData } from "@/app/utils/functions";
export const dynamic = "force-dynamic"
export default async function Home() {

  const data = await fetchData();
  console.log(data)

  return (
    <>
      <div id="homePageContainer" className="absolute grid grid-rows-12 grid-cols-12 gap-6 h-screen w-screen">
        
        <div className="row-start-3 row-end-7 col-start-4 col-end-10">
          <ReminderModule />
        </div>

        <div className="row-start-7 row-end-11 col-start-4 col-end-10">
          <RecipeModule />
        </div>
        
        <div className="row-start-11 row-end-12 col-start-7 col-end-10">
          <CommunityModule />
        </div>
      </div>
      <Navbar />
    </>
  );
}
