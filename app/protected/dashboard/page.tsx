
// UI Import
import Navbar from "../../ui/home/Navbar";
import RecipeModule from "../../ui/home/RecipeModule";
import ReminderModule from "../../ui/home/ReminderModule";
import CommunityModule from "../../ui/home/CommunityModule";

//UID GRAB
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { verify } from "jsonwebtoken";
import { JwtPayload } from "@/app/utils/interfaces";
import { fetchData } from "@/app/utils/functions";

export default async function Home() {

  const data = await fetchData();
  // //Grab Cookie and decode
  // var data: JwtPayload | undefined;
  // const fetchData = async () => {
  //   try {
  //     const cookieStore = cookies();
  //     const token = cookieStore.get(COOKIE_NAME);

  //     if (!token) {
  //       throw new Error('No token found in cookie');
  //     }

  //     const { value } = token;

  //     const secret = process.env.JWT_SECRET || "";
  //     const decodedToken = verify(value, secret) as JwtPayload;

  //     data = decodedToken;
  //     console.log("Decoded token:", decodedToken);
  //   } catch (error) {
  //     console.error('Error decoding cookie:', error);
  //   }
  // };

  // fetchData();

  console.log(data, 'asdasdasd')

  return (
    <>
      <div id="homePageContainer" className="absolute grid grid-rows-12 grid-cols-12 gap-6 h-screen w-screen">
        <div className="row-start-3 row-end-7 col-start-4 col-end-6">
          <ReminderModule />
        </div>
        <div className="row-start-3 row-end-7 col-start-6 col-end-10">
          <RecipeModule />
        </div>
        <div className="row-start-7 row-end-11 col-start-4 col-end-8">
          <ReminderModule />
        </div>
        <div className="row-start-7 row-end-11 col-start-8 col-end-10">
          <ReminderModule />
        </div>
        <div className="row-start-11 row-end-12 col-start-7 col-end-10">
          <CommunityModule />
        </div>
      </div>
      <Navbar />
    </>
  );
}
