'use client'

import React from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import ExpireSoonList from '../inventory/ExpireSoonList';
import { useTestContext } from '@/app/protected/layout';
import { useEffect } from 'react';

function ReminderModule() {
  const uid = useTestContext();

  

  return (
    <motion.div
      className="h-full bg-slate-200/10 shadow-xl rounded-xl overflow-hidden"
      style={{ width: '100%' }}
      whileHover={{ scale: 1.05, transition: { duration: 0.5 } }}
    >
      <div className="relative rounded-t-xl bg-gradient-to-r from-blue-300/20 to-indigo-300/20 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md flex justify-center items-center w-12 h-12">
          <Image src="/bell.png" alt="icon" width={25} height={25} />
        </div>
        <p className="absolute top-3 left-16 pl-2 font-dm_sans tracking-tighter text-xl font-bold text-slate-800 select-none">
          Reminders
        </p>
        <div className="absolute top-9 left-16 pt-1 pl-2 flex items-center space-x-1">
          <Image src="/clock.png" alt="icon" width={23} height={23} />
          <p className="font-dm_mono text-sm tracking-tighter text-slate-500 select-none">UPCOMING</p>
        </div>
      </div>
      <div className="overflow-auto max-h-80 md:max-h-96 lg:max-h-120 xl:max-h-144">
        <ExpireSoonList />
      </div>
    </motion.div>
  );
}

export default ReminderModule