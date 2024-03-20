'use client' // Enable client-sided-rendering

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface BackgroundProps {
    children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) =>  {
    return (
        <>
            {children}
            <div className="flex items-center justify-center">
                <div
                    id="background"
                    className="inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_6rem]"
                />
            </div>
        </>
    );
}

export default Background