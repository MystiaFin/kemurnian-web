import { useState, useEffect, useRef } from "react";
import { RiErrorWarningLine, RiCloseCircleLine, RiDeleteBinLine } from "@remixicon/react";

interface Item {
    title: string;
}

interface ConfirmationModalProps {
    item: Item;
    onConfirm: () => void;
    onCancel: () => void;
}

const overlay = "fixed inset-0 bg-black/75 flex items-center justify-center z-50 transition-opacity duration-300 will-change-opacity";
const card = "w-96 bg-white rounded-xl shadow-2xl p-8 will-change-transform";
const iconContainer = "flex justify-center mb-6";
const iconCircle = "w-20 h-20 bg-red-600 rounded-full flex items-center justify-center";
const title = "text-xl font-semibold mb-2 text-center text-gray-800";
const description = "text-gray-600 mb-6 text-center";
const buttonContainer = "flex gap-3 justify-center";
const button = "flex items-center justify-center px-2 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer relative overflow-hidden w-30 gap-1";
const cancelButton = `${button} bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-900 hover:shadow-lg`;
const deleteButton = `${button} bg-red-700 hover:bg-red-800 text-white hover:shadow-lg`;

export default function ConfirmationModal({
    item,
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    useEffect(() => {
        if (isHolding) {
            startTimeRef.current = Date.now();

            holdTimerRef.current = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                const linearProgress = Math.min(elapsed / 2500, 1);

                // Ease-out curve: fast at beginning, slow at end
                const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
                const newProgress = easedProgress * 100;

                setProgress(newProgress);

                if (newProgress >= 100) {
                    handleConfirmComplete();
                }
            }, 16);
        } else {
            if (holdTimerRef.current) {
                clearInterval(holdTimerRef.current);
            }
            setProgress(0);
        }

        return () => {
            if (holdTimerRef.current) {
                clearInterval(holdTimerRef.current);
            }
        };
    }, [isHolding]);

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(onCancel, 300);
    };

    const handleConfirmComplete = () => {
        setIsHolding(false);
        setIsVisible(false);
        setTimeout(onConfirm, 300);
    };

    const handleMouseDown = () => {
        setIsHolding(true);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
    };

    const handleMouseLeave = () => {
        setIsHolding(false);
    };

    return (
        <>
            <main className={`${overlay} ${isVisible ? "opacity-100" : "opacity-0"}`} onClick={handleCancel}>
                <div
                    className={card}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        animation: isVisible ? "bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "none",
                        transform: "translate3d(0, 0, 0)"
                    }}
                >
                    <div className={iconContainer}>
                        <div className={iconCircle}>
                            <RiErrorWarningLine size={46} color="white" />
                        </div>
                    </div>

                    <h2 className={title}>Are you sure?</h2>
                    <p className={description}>
                        Do you really want to delete "{item.title}"? This action cannot be undone.
                    </p>

                    <div className={buttonContainer}>
                        <button onClick={handleCancel} className={cancelButton}>
                            <RiCloseCircleLine size={18} color="white" />
                            Cancel
                        </button>
                        <button
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            className={deleteButton}
                        >
                            <span
                                className="absolute inset-0 bg-red-900 transition-all duration-75"
                                style={{
                                    width: `${progress}%`,
                                    left: 0
                                }}
                            />
                            <span className="relative z-10 flex items-center gap-1">
                                {progress > 0 ? (
                                    `Hold (${(2 - (progress / 100 * 2)).toFixed(1)}s)`
                                ) : (
                                    <>
                                        <RiDeleteBinLine size={18} color="white" />
                                        Delete
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

