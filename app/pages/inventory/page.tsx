"use client"

import { useState } from "react";
import Background from "../../ui/home/Background";
import CategoryModal from "../../ui/recipes/CategoryModal";
import { useRouter } from 'next/navigation';
import { Dialog } from "@headlessui/react";

export default function InventoryPage() {

    
    return (
        <div className="flex justify-center items-center h-screen">
            <CategoryModal />
        </div>


    );
}