import { useEffect, useRef } from 'react';

const Modal = ({ isOpen = false, onClose, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, dialogRef]);

  return (
    <dialog
      ref={dialogRef}
      className="relative rounded-lg bg-my-grad shadow-lg p-6 w-96 mx-auto  border border-gray-300 backdrop:bg-gray-900/80"
      onClose={onClose}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
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
