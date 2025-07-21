import React, { FC } from "react";

interface CourtsCardsProps {
    badgeCount: number;
    courtName: string;
    courtNumber: number;
}

const CourtsCards: FC<CourtsCardsProps> = ({ badgeCount, courtName, courtNumber }) => {
    return (
        <div className="content-wrapper position-relative">
            <span className="position-absolute   badge rounded-pill bg-danger" >{badgeCount}</span>
            <img src="/icons/court-icon.svg" alt="" />
            <div className="d-flex align-items-center justify-content-between mt-2">
                <span className="fw-semibold fs-6">{courtName}</span>
                <span className="fw-semibold fs-5">{courtNumber}</span>
            </div>
        </div>
    );
};

export default CourtsCards;