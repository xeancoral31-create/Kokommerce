import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    endDate: string | null;
    onExpire?: () => void;
    className?: string;
    labelClassName?: string;
    timeClassName?: string;
}

export default function CountdownTimer({ 
    endDate, 
    onExpire, 
    className = "", 
    labelClassName = "text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1",
    timeClassName = "text-sm font-black text-gray-900 tabular-nums"
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isExpired: boolean;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

    useEffect(() => {
        if (!endDate) {
            setTimeLeft(prev => ({ ...prev, isExpired: false }));
            return;
        }

        const target = new Date(endDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                if (onExpire) onExpire();
                return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isExpired: false
            };
        };

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft.isExpired) {
                clearInterval(timer);
            }
        }, 1000);

        // Initial call
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [endDate, onExpire]);

    if (!endDate) {
        return (
            <div className={className}>
                <p className={labelClassName}>Invitation Validity Remaining</p>
                <div className="flex items-baseline gap-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col items-start min-w-[3ch]">
                            <span className={timeClassName}>∞<span className="text-[0.6em] ml-1 opacity-40">D</span></span>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className={timeClassName}>
                                --<span className="text-[0.6em] mx-1 opacity-40">H</span>
                                --<span className="text-[0.6em] mx-1 opacity-40">M</span>
                                --<span className="text-[0.6em] ml-1 opacity-40">S</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (timeLeft.isExpired) {
        return (
            <div className={className}>
                <p className={labelClassName}>Curation Status</p>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"></div>
                    <span className={`${timeClassName} text-red-500 tracking-[0.2em] font-black italic`}>EXPIRED</span>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <p className={labelClassName}>Invitation Validity Remaining</p>
            <div className="flex items-baseline gap-4">
                <div className="flex gap-4">
                    {timeLeft.days > 0 && (
                        <div className="flex flex-col items-start min-w-[3ch]">
                            <span className={timeClassName}>{timeLeft.days}<span className="text-[0.6em] ml-1 opacity-40">D</span></span>
                        </div>
                    )}
                    <div className="flex flex-col items-start">
                        <span className={timeClassName}>
                            {timeLeft.hours.toString().padStart(2, '0')}<span className="text-[0.6em] mx-1 opacity-40">H</span>
                            {timeLeft.minutes.toString().padStart(2, '0')}<span className="text-[0.6em] mx-1 opacity-40">M</span>
                            {timeLeft.seconds.toString().padStart(2, '0')}<span className="text-[0.6em] ml-1 opacity-40">S</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
