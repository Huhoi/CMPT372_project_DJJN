'use client'

import React, { useState } from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import { Recipe } from './DisplayRecipes';
import EditRecipeModal from './EditRecipeModal';

// NOTE: Can get rid of some of these parameters if we decide to do another call when clicking on a recipe
function RecipeCard({ rid, title, instruction, last_modified, favorite, uid }: Recipe) {
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

  // Date formatting
  var displayDate = new Date(last_modified).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" }) + ", " +
    new Date(last_modified).toLocaleTimeString('en-us');

  return (
    <>
      <motion.div className="cursor-pointer bg-slate-200/10 shadow-xl backdrop-blur-sm rounded-xl" style={{ height: "400px", width: "90%" }}
        whileHover={{ scale: 1.03, transition: { duration: 0.3 }, }} onClick={() => openModal()}>
        <div id="imageContainer" className="flex justify-center items-center">
          <Image src="/image-unavailable.png" alt={'Image not available'}
            className="rounded-xl"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}></Image>
        </div>
        <div className="absolute bottom-0 rounded-b-xl bg-gradient-to-r from-blue-100 to-indigo-100 h-screen" style={{ height: "35%", width: "100%" }}>
          <div className="px-4 pt-4 text-bold font-dm_sans tracking-tighter text-2xl flex justify-between">{title}</div>
          <div className="p-4 text-bold font-dm_mono tracking-tighter text-sm">Last modified: <br></br>{displayDate}</div>
        </div>
      </motion.div>
      <EditRecipeModal rid={rid} title_prop={title} instruction_prop={instruction} last_modified_prop={last_modified} favorite_prop={favorite} modalTitle={`Modify ${title}`} isOpen={checkIsOpen} onClose={closeModal}> </EditRecipeModal>
    </>
  )
}

export default RecipeCard