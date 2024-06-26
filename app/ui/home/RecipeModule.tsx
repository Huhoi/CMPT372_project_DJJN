'use client'

import React from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import Link from 'next/link';
import FavouriteRecipesList from '../recipes/FavouriteRecipesList';

function RecipeCard() {
  return (
    <motion.div className="h-full w-full bg-slate-200/10 shadow-xl rounded-xl"
      whileHover={{ scale: 1.05, transition: { duration: 0.5 }, }}>
      <Link href="/protected/signedIn/recipes">
        <div className="relative rounded-t-xl bg-gradient-to-r from-blue-300/20 to-indigo-300/20 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-red-500 to-orange-300 rounded-md flex justify-center items-center w-12 h-12">
            <Image className="pointer-events-none select-none" src="/tools-kitchen-2.png" alt="icon" width={25} height={25}></Image>
          </div>
          <p className="absolute top-3 left-16 pl-2 font-dm_sans tracking-tighter text-xl font-bold text-slate-800 select-none">Recipes</p>
          <Image className="absolute top-9 left-16 pt-1 pl-2 pointer-events-none select-none" src="/star.png" alt="icon" width={23} height={23}></Image>
          <p className="absolute top-9 left-20 pt-0.5 pl-2.5 font-dm_mono text-sm tracking-tighter text-slate-500 select-none">FAVORITES</p>
        </div>
      </Link>
      <div>
        <FavouriteRecipesList />
      </div>
    </motion.div>
  )
}

export default RecipeCard