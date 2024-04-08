'use client'

import Image from 'next/image';
import { motion } from "framer-motion";
import { Community } from './DisplayCommunity';
import ShowButton from './ShowButton';


// NOTE: Can get rid of some of these parameters if we decide to do another call when clicking on a recipe
function CommunityCard({ id, title, image, imageType }: Community) {
    return (
        <motion.div
            className="bg-slate-200/10 shadow-xl backdrop-blur-sm rounded-xl"
            style={{ height: '400px', width: '90%' }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
        >
            <div className="flex flex-col items-center h-full">
                <div className="mb-2 mt-8"> {/* Added mt-4 for margin-top */}
                    <Image src={image} alt={title} className="rounded-xl" width={200} height={200} />
                </div >
                <p className="text-center py-2 px-2 my-4 h-10 font-dm_sans tracking-tighter font-bold text-gray">{title}</p>
            </div >
            <div className="absolute bottom-0 rounded-t-xl bg-gradient-to-r from-blue-100 /20 to-indigo-100/20 h-screen" style={{ height: '35%', width: '100%', paddingLeft: '30px' }}>
                <ShowButton id={id} />
            </div>
        </motion.div >
    );
}

export default CommunityCard