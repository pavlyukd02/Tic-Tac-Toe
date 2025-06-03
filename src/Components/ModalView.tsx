interface ModalProps {
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
}

const ModalView = ({ isOpen, message, onClose }: ModalProps) =>
  isOpen ? (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <p>{message}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  ) : null;

export default ModalView;