'use client'
import { useEffect, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import { motion } from "framer-motion";
import Image from "next/image";
import CategoryModal from "./CategoryModal";
import IngredientModal from "./IngredientModal";

// modal for adding a new category using Modal component
const SelectionModal: React.FC<ModalProps> = ({ modalTitle, isOpen, onClose, children }) => {
    const [image1, setImage1] = useState("/circle-plus-1.png");
    const [image2, setImage2] = useState("/circle-plus-1.png");

    const [checkIsOpenIngredient, setIsOpenIngredient] = useState(false);
    const [checkIsOpenCategory, setIsOpenCategory] = useState(false);

    async function openModalIngredient() {
        if (!checkIsOpenIngredient) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setIsOpenIngredient(!checkIsOpenIngredient);
        }
    }
    
    function closeModalIngredient() {
        if (checkIsOpenIngredient) {
          setIsOpenIngredient(!checkIsOpenIngredient);
        }
    }

    async function openModalCategory() {
        if (!checkIsOpenCategory) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setIsOpenCategory(!checkIsOpenCategory);
        }
    }
    
    function closeModalCategory() {
        if (checkIsOpenCategory) {
          setIsOpenCategory(!checkIsOpenCategory);
        }
    }

    return (
        <>
            <Modal modalTitle={modalTitle} isOpen={isOpen} onClose={onClose}>
                <div id="selectionContainer" className="min-h-[400px] p-4 py-8 flex justify-center gap-4">
                    <motion.div id="selectIngredient"
                    onClick={(e) => {
                        onClose(),
                        openModalIngredient()
                    }}
                    className="w-1/2 border-dashed border-4 border-slate-300 hover:border-slate-400 rounded-3xl flex justify-center items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 }, }}
                    onMouseEnter={() => setImage1("/circle-plus-2.png")}
                    onMouseLeave={() => setImage1("/circle-plus-1.png")}
                    onFocus={() => setImage1("/circle-plus-1.png")}>
                        <Image className="pointer-events-none select-none" priority src={image1} alt="icon" width={50} height={50}></Image>
                        <p className="font-dm_sans text-2xl font-bold tracking-tighter">Ingredient</p>
                    </motion.div>
                    <motion.div id="selectCategory"
                    onClick={(e) => {
                        onClose(),
                        openModalCategory()
                    }}
                    className="w-1/2 border-dashed border-4 border-slate-300 hover:border-slate-400 rounded-3xl flex justify-center items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 }, }}
                    onMouseEnter={() => setImage2("/circle-plus-2.png")}
                    onMouseLeave={() => setImage2("/circle-plus-1.png")}
                    onFocus={() => setImage2("/circle-plus-1.png")}>
                        <Image className="pointer-events-none select-none" priority src={image2} alt="icon" width={50} height={50}></Image>
                        <p className="font-dm_sans text-2xl font-bold tracking-tighter">Category</p>
                    </motion.div>
                </div>
            </Modal>
            <IngredientModal modalTitle={"Create a new ingredient"} isOpen={checkIsOpenIngredient} onClose={closeModalIngredient}> </IngredientModal>
            <CategoryModal modalTitle={"Create a new category"} isOpen={checkIsOpenCategory} onClose={closeModalCategory}> </CategoryModal>
        </>
    );
};

export default SelectionModal;