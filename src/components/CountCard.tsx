import React, { FC } from "react";
import Link from "next/link";

interface CountCardsProps {
  badgeCount: number,
  title: string,
  caseCount: number,
  cardColor: string,
  link?: string,
  onClick?: () => void,
}

const CountCards: FC<CountCardsProps> = ({ badgeCount = 0, title, cardColor, caseCount, link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const cardContent = (
    <div 
      className="box d-flex justify-content-between align-items-center position-relative" 
      style={{ background: `${cardColor}`, cursor: link ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      {badgeCount > 0 && 
        <span className="position-absolute badge rounded-pill bg-danger" style={{ top: '12px' }}>{badgeCount}</span>
      }
      <span className="fs-4 text-white fw-semibold">{title}</span>
      <h3 className="mt-2 text-white fs-1 fw-semibold" >
        {caseCount}
      </h3>
    </div>
  );

  if (link) {
    return (
      <Link href={link} style={{ textDecoration: 'none' }}>
        {cardContent}
      </Link>
    )
  }

  return cardContent;
};

export default CountCards;