import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomLeftArrow = ({ onClick }) => (
  <div className="custom-arrow left-arrow relative" onClick={onClick}>
    <FaChevronLeft />
  </div>
);

const CustomRightArrow = ({ onClick }) => (
  <div className="custom-arrow right-arrow relative" onClick={onClick}>
    <FaChevronRight />
  </div>
);

export { CustomLeftArrow, CustomRightArrow };
