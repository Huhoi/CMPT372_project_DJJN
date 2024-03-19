// UI Import
import Navbar from "./ui/home/Navbar";
import Background from "./ui/home/Background";
import RecipeCard from "./ui/home/RecipeCard";
import ReminderCard from "./ui/home/ReminderCard";
import CommunityCard from "./ui/home/CommunityCard";
import pool from './utils/connectDB';

//Library Import
import { redirect } from 'next/navigation';

export default function Home() {

  // //TEMP Until DB CONNECTION IS WORKING
  // const loginUser = false;

  // // Redirect to login page if user is not logged in
  // if (!loginUser) {
  //   redirect('/pages/login');
  // }

  const fetchDataFromDB = async () => {
    try {
      const client = await pool.connect();
      console.log("Connected to db");
  
      const result = await client.query("SELECT * FROM users");
      const data = result.rows;
      console.log("Fetched data:", data);
  
      client.release(); // Release the client back to the pool
      return data;
    }
    catch (e) {
      console.log("Received data:", e)
      throw e;
    }
  };
  
  // Call fetchDataFromDB
  fetchDataFromDB()
  .then(data => {
      console.log("Received data:", data);
      // Handle the received  data here
  })
  .catch(e => {
      // Handle the error here
      console.error("Error fetching data:", e);
  });

  return (
    <>
      <Background>
        <div id="homePageContainer" className="absolute grid grid-rows-12 grid-cols-12 gap-6 h-screen w-screen">
          <div className="row-start-3 row-end-7 col-start-4 col-end-6">
            <ReminderCard />
          </div>
          <div className="row-start-3 row-end-7 col-start-6 col-end-10">
            <RecipeCard />
          </div>
          <div className="row-start-7 row-end-11 col-start-4 col-end-8">
            <ReminderCard />
          </div>
          <div className="row-start-7 row-end-11 col-start-8 col-end-10">
            <ReminderCard />
          </div>
          <div className="row-start-11 row-end-12 col-start-7 col-end-10">
            <CommunityCard />
          </div>
        </div>
        <Navbar />
      </Background>
    </>
  );
}
