import React from 'react'
import Link from "next/link";

function Navbar() {
  return (
    <div id="container" className="p-8 backdrop-blur-sm bg-slate-500/10 fixed left-0 top-0 w-full grid grid-cols-8" style={{ height: "100px" }}>
      <nav id="home" className="col-span-1 col-start-1 flex flex-row justify-around">
        <Link href="/pages/dashboard" className="font-dm_sans tracking-tighter text-2xl font-bold">Recipe.app</Link>
      </nav>
      <nav id="navigation" className="pt-2 col-span-4 col-start-5 flex flex-row justify-around">
        <Link href="/protected/signedIn/recipes" className="font-dm_mono tracking-widester text-sm font-medium">RECIPES</Link>
        <Link href="/protected/signedIn/inventory" className="font-dm_mono tracking-widester text-sm font-medium">INVENTORY</Link>
        <Link href="/protected/signedIn/community" className="font-dm_mono tracking-widester text-sm font-medium">FIND RECIPES</Link>
        <Link href="/protected/signedIn/account" className="font-dm_mono tracking-widester text-sm font-medium">ACCOUNT</Link>
      </nav>
    </div>
  )
}

export default Navbar