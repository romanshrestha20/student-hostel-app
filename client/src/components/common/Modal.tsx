import React from "react";
import { createPortal } from "react-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

interface ModalProps {
  open: boolean; // Controls visibility
  onClose: () => void; // Callback to close the modal
  children: React.ReactNode; // You decide what content it holds
  className?: string; // Optional custom styling
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  const modalRef = React.useRef<HTMLDivElement | null>(null); // Reference to the modal element
  // Effect to handle body scroll locking when modal is open
  // This prevents background scrolling when the modal is active
  // It uses the body-scroll-lock library to manage scroll behavior
  // The cleanup function ensures that scroll locking is removed when the modal closes
  React.useEffect(() => {
    const modalEl = modalRef.current;
    if (open && modalEl) {
      disableBodyScroll(modalEl);
    } else {
      enableBodyScroll(document.body);
    }
    return () => enableBodyScroll(document.body);
  }, [open]);

  if (!open) return null;
  // Render the modal using createPortal to render it outside the main DOM hierarchy
  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in ${
          className || ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute text-2xl text-gray-500 top-2 right-2 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
export default Modal;
