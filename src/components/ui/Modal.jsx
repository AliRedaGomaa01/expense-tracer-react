import { useEffect, useRef, useState } from 'react';

const Modal = ({ isOpen = false, onClose, children }) => {
  const dialogRef = useRef(null);
  const [classNames, setClassNames] = useState('');

  useEffect(() => {
    if (!!dialogRef.current) {
      if (isOpen) {
        dialogRef.current.showModal();
        setClassNames('opacity-[0.1] scale-[0.1]');
        setTimeout(() => setClassNames('opacity-[1] scale-[1]'), 50);
      } else {
        setClassNames('opacity-[0.1] scale-[0.1] -z-10');
        setTimeout(() => dialogRef.current.close(), 200);
      }
    }
  }, [isOpen, dialogRef]);

  return isOpen && (
    <dialog
      ref={dialogRef}
      className={"fixed rounded-lg bg-my-grad shadow-lg p-6 w-96 mx-auto  border border-gray-300 backdrop:bg-gray-900/80 transition-all duration-200 flex place-self-center min-h-screen" + classNames}
      onClose={onClose}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 outline-none border-none"
        onClick={e => e.target.closest('dialog').close()}
        aria-label="Close"
      >
        &times;
      </button>

      <div>{children}</div>
    </dialog>
  );
};

export default Modal;
