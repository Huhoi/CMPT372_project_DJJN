"use client"

export interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}


// base component for modal, contents are passed in as children
const Modal: React.FC<ModalProps> = ({title, isOpen, onClose, children}) => {

    function handleSubmit() {

    }

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
                                    <Dialog.Title className="font-dm_sans tracking-tighter text-2xl font-bold text-slate-800 p-6">{title}</Dialog.Title>
                                    <Dialog.Description className="px-6 text-sm text-slate-800">
                                        {children}
                                    </Dialog.Description>
                                
                                    <div id="buttonContainer" className="absolute px-4 bottom-0 h-1/8 w-full bg-gradient-to-r from-blue-100 to-indigo-100 grid grid-cols-5 grid-rows-1 gap-2 justify-center items-center">
                                        <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold col-start-1 col-end-1 text-indigo-400 hover:text-white bg-transparent hover:bg-indigo-500 border-2 border-indigo-400 hover:border-indigo-500 rounded-md flex justify-center items-center" onClick={onClose}>Reset</button>
                                        <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold hover:bg-slate-900/10 text-slate-500 hover:text-slate-950 col-start-4 col-end-4 rounded-md flex justify-center items-center" onClick={onClose}>Cancel</button>
                                        <button className="py-4 my-4 h-10 font-dm_sans tracking-tighter font-bold bg-indigo-600 hover:bg-indigo-700 text-white col-start-5 col-end-5 rounded-md flex justify-center items-center" onClick={onClose}>Save</button>
                                    </div>
                                    
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