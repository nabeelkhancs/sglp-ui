import React, { FC } from "react";

interface CountCardsProps {
  badgeCount: number,
  title: string,
  caseCount: number,
  cardColor: string
}

const CountCards: FC<CountCardsProps> = ({ badgeCount, title, cardColor, caseCount }) => {
  return (
    <div className="box d-flex justify-content-between align-items-center position-relative" style={{ background: `${cardColor}`, }}
    >
      <span className="position-absolute   badge rounded-pill bg-danger" style={{ top: '12px' }}>{badgeCount}</span>
      <span className="fs-5 text-white fw-semibold">{title}</span>
      <h3 className="mt-2 text-white fs-1 fw-semibold" >
        {caseCount}
      </h3>

    </div>


  );
};

export default CountCards;