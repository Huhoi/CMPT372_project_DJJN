'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import { motion } from "framer-motion";
import CommunityRecipeModal from '@/app/ui/community/CommunityRecipeModal';
import DisplayCommunity from '@/app/ui/community/DisplayCommunity';

export default function CommunityPage() {
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
                    <Image className="pointer-events-none select-none" priority src={image} alt="icon" width={50} height={50}></Image>
                    <p className="font-dm_sans text-4xl font-bold tracking-tighter">Find a Recipe</p>
                </motion.div>
            </div>
            <CommunityRecipeModal modalTitle={"Find a Recipe"} isOpen={checkIsOpen} onClose={closeModal}> </CommunityRecipeModal>
            <div className="flex flex-wrap w-full mt-8 justify-center items-center h-screen overflow-auto">
                <DisplayCommunity />
            </div>

        </>

    )
}