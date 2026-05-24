// src/hooks/useFloatingButton.ts
import { useState, useEffect } from "react";

export function useFloatingButton() {
    const [showFloatingButton, setShowFloatingButton] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const pagination = document.getElementById("pagination");
            if (!pagination) {
                setShowFloatingButton(true);
                return;
            }

            const rect = pagination.getBoundingClientRect();
            const shouldHide = rect.top < window.innerHeight * 0.99;

            setShowFloatingButton(!shouldHide);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return showFloatingButton;
}