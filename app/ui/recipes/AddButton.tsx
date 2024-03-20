'use client'

import React, { useState } from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import RecipeModal from './RecipeModal';

function AddButton() {
  const [image, setImage] = useState("/circle-plus-1.png");
  const [checkIsOpen, setIsOpen] = useState(false);

  function openModal() {
    if (!checkIsOpen) {
      setIsOpen(!checkIsOpen);
    }
  }

  // This function is passed into the Modal component
  function closeModal() {
    if (checkIsOpen) {
      setIsOpen(!checkIsOpen);
    }
  }

  return (
    <>
      <div className="h-[10%] w-full cursor-pointer shadow-xl backdrop-blur-sm rounded-xl text-slate-400 hover:text-slate-600 bg-gradient-to-r from-blue-300/30 to-indigo-300/30 flex justify-center items-center"
        onClick={() => openModal()}
        onMouseEnter={() => setImage("/circle-plus-2.png")}
        onMouseLeave={() => setImage("/circle-plus-1.png")}
        onFocus={() => setImage("/circle-plus-1.png")}>
        <motion.div className="p-6 flex flex-grow justify-center items-center gap-2" whileHover={{ scale: 1.03, transition: { duration: 0.3 }, }}>
          <Image className="pointer-events-none select-none" src={image} alt="icon" width={50} height={50}></Image>
          <p className="font-dm_sans text-4xl font-bold tracking-tighter">Create a new recipe</p>
        </motion.div>
        <RecipeModal title={"Untitled recipe"} isOpen={checkIsOpen} onClose={closeModal} children={undefined} />
      </div>
    </>
    
  )
}

export default AddButton