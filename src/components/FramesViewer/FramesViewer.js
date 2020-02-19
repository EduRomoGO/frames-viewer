import React, { useEffect, useState } from 'react';
import FramesTable from '../FramesTable/FramesTable.js';
import { prepareForRender } from './dataConverter.js';
import Button from '../uic/Button/Button.js';
import { copyToClipboard } from '../../utils/copyToClipboard.js';
import './FramesViewer.css';
import Modal from 'react-modal';
import { useDataFetchingHook } from './useDataFetchingHook.js';

Modal.setAppElement('#root');

const FramesViewer = () => {
  const [visibleFrames, setVisibleFrames] = useState('first');
  const [{ frames, columns, isLoading, isError }, doRetry] = useDataFetchingHook();
  useEffect(() => {
    if (visibleFrames === 'all') {
      copyToClipboard(JSON.stringify(frames));
    }
  }, [frames, visibleFrames]);


  const renderServerError = () => {
    return <div key='serverError'>An error happened, please try again <Button name='try again' onClick={doRetry} /></div>;
  }

  const renderUnauthorizedError = () => {
    // I am asuming that closing the modal retries the calls
    const closeModal = () => {
      doRetry();
    };

    const customStyles = {
      content: {
        height: '200px',
      }
    };

    return <Modal
      key='modal'
      isOpen={isError.error}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div className='modal__close' onClick={closeModal}>x</div>
      <div className='modal__inner'>
        <div className='modal__text'>You are not authorised</div>
      </div>
    </Modal>
  }

  const renderErrorView = isError => {
    const getErrorView = () => {
      const endpoint = Object.keys(isError.endpoints)[0];

      if (isError.endpoints[endpoint] === '401') {
        return renderUnauthorizedError();
      } else if (isError.endpoints[endpoint] === '500') {
        return renderServerError();
      }
    };

    return <div className='c-error'>{getErrorView()}</div>;
  }

  const renderLoadingView = () => {
    return <div>Loading...</div>
  }

  const renderFrameView = (visibleFrames, columns, frames) => {
    if (visibleFrames && columns.length && Object.keys(frames).length > 0) {
      const { columnNamesList, framesArray } = prepareForRender({ columns, frames })
      const getVisibleFramesList = (framesArray, visibleFrames) => {
        return visibleFrames === 'all' ? framesArray : framesArray.filter(item => item.position === visibleFrames);
      };

      const handleFramesButtonClick = buttonName => {
        setVisibleFrames(buttonName);
      }

      const handleCopyButton = () => {
        setVisibleFrames('all');
      }

      return <section className='c-frames-viewer__subwrapper'>
        <header>
          <h1>Frames</h1>
        </header>
        <section className='c-frames-viewer__actions'>
          <div className='c-frames-viewer__actions-frames'>
            <Button name='first' onClick={handleFramesButtonClick} />
            <Button name='middle' onClick={handleFramesButtonClick} />
            <Button name='last' onClick={handleFramesButtonClick} />
          </div>
          <div className='c-frames-viewer__action-copy-wrapper'>
            <Button name='Copy' onClick={handleCopyButton} />
          </div>
        </section>
        <FramesTable visibleFramesList={getVisibleFramesList(framesArray, visibleFrames)} columnNamesList={columnNamesList} />
      </section>
    } else {
      return '';
    }
  };


  return <section className='c-frames-viewer'>
    {
      isLoading
        ? renderLoadingView()
        : isError.error ? renderErrorView(isError) : renderFrameView(visibleFrames, columns, frames)
    }
  </section>
};

export default FramesViewer;
