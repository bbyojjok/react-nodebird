import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import styled, { createGlobalStyle } from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  & header {
    height: 44px;
    background-color: #fff;
    position: relative;
    padding: 0;
    text-align: center;

    & h1 {
      margin: 0;
      font-size: 17px;
      color: #333;
      line-height: 44px;
    }

    & button {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;
  box-sizing: border-box;

  & img {
    margin: 0 auto;
    max-height: 750px;
    max-width: 100%;
  }
`;

const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: #fff;
    font-size: 15px;
  }
`;

const Global = createGlobalStyle`
  .slick-slide {
    display:inline-block;
  }
`;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const setCurrentSlide = useCallback((slide) => {});

  return (
    <Overlay>
      <Global />
      <header>
        <h1>상세 이미지</h1>
        <button onClick={onClose}>X</button>
      </header>
      <SlickWrapper>
        <div>
          <Slider
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite={true}
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slider>
          <Indicator>
            <div>{`${currentSlide + 1} / ${images.length}`}</div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
