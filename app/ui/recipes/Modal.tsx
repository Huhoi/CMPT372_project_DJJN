"use client"

import { Fragment, useState } from "react";
import Background from "../home/Background";
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}


// base component for modal, contents are passed in as children
const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}) => {

    return (
            
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-10">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >

                            <Dialog.Panel className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Description as="div" className="text-sm text-gray-500">
                                    {children}
                                </Dialog.Description>
                                <button onClick={onClose}>Close</button>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
}

export default Modal;