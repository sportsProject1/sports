export const handleNextSlide = (currentIndex, length) => {
    return (currentIndex + 1) % length;
};

export const handlePrevSlide = (currentIndex, length) => {
    return (currentIndex - 1 + length) % length;
};
