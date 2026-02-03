import { useState, useEffect, useCallback } from 'react';

export const useSmartEvasion = (
    ref: React.RefObject<HTMLButtonElement | null>,
    isActive: boolean = true
) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const calculateNextPosition = useCallback((currentX: number, currentY: number, moveX: number, moveY: number, button: HTMLButtonElement) => {
        let newX = currentX + moveX;
        let newY = currentY + moveY;

        const currentRect = button.getBoundingClientRect();
        const nextLeft = currentRect.left + moveX;
        const nextTop = currentRect.top + moveY;
        const nextRight = nextLeft + currentRect.width;
        const nextBottom = nextTop + currentRect.height;

        const padding = 20;

        // Bounce logic to keep it on screen
        if (nextLeft < padding) newX += Math.abs(moveX) * 2;
        if (nextRight > window.innerWidth - padding) newX -= Math.abs(moveX) * 2;
        if (nextTop < padding) newY += Math.abs(moveY) * 2;
        if (nextBottom > window.innerHeight - padding) newY -= Math.abs(moveY) * 2;

        return { x: newX, y: newY };
    }, []);

    const evade = useCallback(() => {
        if (!isActive || !ref.current) return;
        const button = ref.current;

        // Pick a random direction
        const angle = Math.random() * Math.PI * 2;
        const moveDistance = 150;
        const moveX = Math.cos(angle) * moveDistance;
        const moveY = Math.sin(angle) * moveDistance;

        setPosition(prev => calculateNextPosition(prev.x, prev.y, moveX, moveY, button));
    }, [isActive, ref, calculateNextPosition]);

    useEffect(() => {
        if (!isActive || !ref.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            const button = ref.current;
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;

            const deltaX = e.clientX - buttonCenterX;
            const deltaY = e.clientY - buttonCenterY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const threshold = 150; // Distance to trigger evasion

            if (distance < threshold) {
                // Move away from cursor
                const angle = Math.atan2(deltaY, deltaX);
                const moveDistance = 150; // How far to move

                // Calculate potential new position (opposite direction)
                const moveX = -Math.cos(angle) * moveDistance;
                const moveY = -Math.sin(angle) * moveDistance;

                // Add random jitter
                const jitterX = (Math.random() - 0.5) * 50;
                const jitterY = (Math.random() - 0.5) * 50;

                setPosition((prev) => calculateNextPosition(prev.x, prev.y, moveX + jitterX, moveY + jitterY, button));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isActive, ref, calculateNextPosition]);

    return { position, evade };
};
