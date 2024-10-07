import {TimeColumn} from "./TimeColumn";
import React, {ReactNode, RefObject} from "react";

interface TimeTableLayoutProps {
    containerRef: RefObject<HTMLDivElement>;
    children: ReactNode;
}

export const TimeTableLayout: React.FC<TimeTableLayoutProps> = ({containerRef, children}) => {
    return (
        <>
            <div ref={containerRef}  // Directly use the RefObject here
                 className="flex-grow grid grid-cols-[0.5fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] overflow-y-auto">
                {/* Time column */}
                <TimeColumn/>

                {/* columns */}
                {children}
            </div>
        </>
    );
};
