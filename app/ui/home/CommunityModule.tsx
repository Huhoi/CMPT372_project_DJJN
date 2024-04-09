'use client'

import React from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import Link from 'next/link';

function CommunityModule() {
  return (
    <Link href="/protected/signedIn/community" className="font-dm_mono tracking-widester text-sm font-medium">
      <motion.div className="bg-neutral-500/20 shadow-xl backdrop-blur-sm rounded-xl" style={{ height: "100%", width: "100%" }}
        whileHover={{ scale: 1.05, transition: { duration: 0.5 }, }}>
        <p className="absolute text-right right-12 p-3 font-dm_sans tracking-tighter text-xl font-bold text-slate-800 select-none">Community</p>
        <Image className="relative float-right top-2.5 mx-4 pointer-events-none select-none" src="/direction-sign.png" alt="icon" width={35} height={35}></Image>
      </motion.div>
    </Link>
  )
}

export default CommunityModule