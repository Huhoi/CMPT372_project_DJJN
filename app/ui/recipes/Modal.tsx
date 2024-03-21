"use client"

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface ModalProps {
    modalTitle: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}


// base component for modal, contents are passed in as children
const Modal: React.FC<ModalProps> = ({modalTitle, isOpen, onClose, children}) => {

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

                            <Dialog.Panel className="pb-1 w-full max-w-3xl transform overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-left align-middle shadow-xl transition-all">
                                <div className="transform overflow-hidden rounded-lg bg-white text-left align-middle transition-all">
                                    <Dialog.Title className="font-dm_sans tracking-tighter text-2xl font-bold text-slate-800 p-6">{modalTitle}</Dialog.Title>
                                    <Dialog.Description as="div" className="px-6 text-sm text-slate-800">
                                        {children}
                                    </Dialog.Description>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
}

export default Modal;