'use client'

import React from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import { Recipe } from './DisplayRecipes';

// NOTE: Can get rid of some of these parameters if we decide to do another call when clicking on a recipe
function RecipeCard({rid, title, instruction, last_modified, favorite, uid}: Recipe) {
  // Date formatting
  var displayDate = new Date(last_modified).toLocaleDateString('en-us', {year:"numeric", month:"long", day:"numeric"}) + ", " +
                    new Date(last_modified).toLocaleTimeString('en-us');

  async function handleDelete() {
    try {
      const response = await fetch(`/api/recipes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rid: rid, uid: uid })
      });

      if (!response.ok) {
        throw new Error('Failed to DELETE');
      }

    } catch (error) {
      console.error('Error with DELETE', error);
    }

    // Then delete from view
    // TEMPORARY FIX: REFRESH PAGE
    window.location.href = "/pages/recipes"
  }

  return (
    <motion.div className="bg-slate-200/10 shadow-xl backdrop-blur-sm rounded-xl" style={{ height: "400px", width: "90%" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 }, }}>
      <div id="imageContainer" className="flex justify-center items-center">
        <Image src="/image-unavailable.png" alt={'image not provided'} 
        className="rounded-xl"
        width={200} height={200}></Image>
      </div>
      <div className="absolute bottom-0 rounded-t-xl bg-gradient-to-r from-blue-100/20 to-indigo-100/20 h-screen" style={{ height: "35%", width: "100%" }}>
          <div className="px-4 pt-4 text-bold font-dm_sans tracking-tighter text-2xl flex justify-between">{title}<button className="px-3 font-dm_sans tracking-tighter text-sm font-bold col-start-1 col-end-1 text-red-400 hover:text-white bg-transparent hover:bg-red-500 border-2 border-red-400 hover:border-red-500 rounded-md flex justify-center items-center" onClick={handleDelete}>Delete</button></div>
          <div className="p-4 text-bold font-dm_mono tracking-tighter text-sm">Created: <br></br>{displayDate}</div>
      </div>
    </motion.div>
  )
}

export default RecipeCard