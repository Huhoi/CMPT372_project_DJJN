'use client'

import Link from 'next/link'
import React from 'react'
import Navlinks from './Navlinks'

function Sidebar() {
  return (
    <div id="sidebarContainer" className="w-full h-full flex flex-col px-3 py-4">
      <Link id="logoLink" href="/protected/dashboard" className="bg-gradient-to-r from-blue-500 to-indigo-500 font-dm_sans text-slate-100 tracking-tighter text-4xl mb-2 flex h-36 items-end justify-start rounded-md p-4 pl-6">RecipeZ
        <div id="logoDiv" className="w-32"></div>
      </Link>

      <div id="navlinks" className="flex justify-between flex-col space-x-0 space-y-2">
        <Navlinks />
      </div>
    </div>
  )
}

export default Sidebar