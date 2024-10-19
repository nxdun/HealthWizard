// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, onSubmit, status, setStatus }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                <h3 className="text-xl font-semibold mb-4">Update Appointment Status</h3>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Status:
                </label>
                <select
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="NoShow">No Show</option>
                    <option value="Completed">Complete</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
