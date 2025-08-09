import React, { FC } from "react";

interface CourtsCardsProps {
    badgeCount?: number;
    courtName: string;
    courtNumber: number;
    showbadgeCount?: boolean;
}

const CourtsCards: FC<CourtsCardsProps> = ({ showbadgeCount = true, badgeCount = 0, courtName, courtNumber = 0 }) => {
    return (
        <div
            className="content-wrapper position-relative"
            style={!showbadgeCount ? { height: '9rem' } : undefined}
        >
            {showbadgeCount && badgeCount > 0 &&
                <span className="position-absolute badge rounded-pill bg-danger" >{badgeCount}</span>
            }
            <img src={showbadgeCount ? "/icons/court-icon.svg" : "/icons/court-single.svg"} alt="" />
            <div className={`d-flex align-items-center justify-content-between ${showbadgeCount ? 'mt-2' : 'mt-4'}`}>
                <span className={`fw-semibold ${showbadgeCount ? 'fs-6' : 'fs-5'}`}>{courtName}</span>
                <span className={`fw-semibold ${showbadgeCount ? 'fs-5' : 'fs-2 color-green-dashboard-selected'}`}>{courtNumber}</span>
            </div>
        </div>
    );
};

export default CourtsCards;