'use client'

import React from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import ExpireSoonList from '../inventory/ExpireSoonList';

function ReminderModule() {
  return (
    <motion.div className="bg-slate-200/10 shadow-xl backdrop-blur-sm rounded-xl" style={{ height: "100%", width: "100%" }}
      whileHover={{ scale: 1.05, transition: { duration: 0.5 }, }}>
      <div className="relative rounded-t-xl bg-gradient-to-r from-blue-300/20 to-indigo-300/20 h-screen flex items-center" style={{ height: "25%", width: "100%" }}>
        <div className="m-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md flex justify-center items-center" style={{ height: "45px", width: "45px" }}>
          <Image className="pointer-events-none select-none" src="/bell.png" alt="icon" width={25} height={25}></Image>
        </div>
        <p className="absolute top-3 left-16 pl-2 font-dm_sans tracking-tighter text-xl font-bold text-slate-800 select-none">Reminders</p>
        <Image className="absolute top-9 left-16 pt-1 pl-2 pointer-events-none select-none" src="/clock.png" alt="icon" width={23} height={23}></Image>
        <p className="absolute top-9 left-20 pt-0.5 pl-2.5 font-dm_mono text-sm tracking-tighter text-slate-500 select-none">UPCOMING</p>
      </div>
      <div>
        <ExpireSoonList />
      </div>
    </motion.div>
  )
}

export default ReminderModule