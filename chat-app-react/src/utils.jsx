import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

export const handleError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        // progress: 1,
        style: { 
            background: "#1a1a1a",                 // Slightly lighter dark background
            border: "1px solid #2d2d2d",           // Subtle border
            boxShadow: "0 4px 12px rgba(196, 181, 253, 0.1)"  // Purple glow
        },
        theme: "dark",
        icon: "🔮",                                // Optional: Purple-themed icon
        autoClose: 3000,                           // Automatically close after 3 seconds
        closeOnClick: true,                        // Allow closing on click
        draggable: true,                           // Allow dragging to close
    });
}

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
        // progress: 1,
        style: { 
            background: "#1a1a1a",                 // Slightly lighter dark background
            border: "1px solid #2d2d2d",           // Subtle border
            boxShadow: "0 4px 12px rgba(196, 181, 253, 0.1)"  // Purple glow
        },
        theme: "dark",
        icon: "💜",                                // Optional: Purple-themed icon
        autoClose: 3000,                           // Automatically close after 3 seconds
        closeOnClick: true,                        // Allow closing on click
        draggable: true,                           // Allow dragging to close
    });
}
