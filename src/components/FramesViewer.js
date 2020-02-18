import React, { useEffect, useState } from 'react';
import { mockFetch } from '../back-end/server.js';
import FramesTable from './FramesTable/FramesTable.js';
import { processData, prepareForRender } from './dataConverter.js';
import Button from './uic/Button/Button.js';


const FramesViewer = () => {
  const [visibleFrames, setVisibleFrames] = useState('first');
  const [frames, setFrames] = useState({});
  const [columns, setColumns] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({
    endpoints: {},
    error: false,
  });
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchEndpointData('/variant')
      await fetchEndpointData('/columns')
      setIsLoading(false);
    };

    fetchData();
  }, []);



  function fetchEndpointData(endpoint) {
    return mockFetch(endpoint)
      .then(data => processData(endpoint, data))
      .then(data => {
        if (endpoint === '/variant') {
          setFrames(data);
        } else if (endpoint === '/columns') {
          setColumns(data);
        }
      })
      .catch(err => {
        if (err.status) {
          setIsError(state => {
            return {
              error: true,
              endpoints: {
                ...state.endpoints,
                [endpoint]: err.status,
              },
            };
          });
        } else {
          throw new Error(err);
        }
      });
  }



  function doRetry() {
    setIsError({
      endpoints: {},
      error: false,
    });
    Object.keys(isError.endpoints).forEach(endpoint => fetchEndpointData(endpoint));
  }

  const renderErrorView = () => {
    return <div>an error happened <button onClick={doRetry}>try again</button></div>;
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

      return <section className='c-frame-viewer__subwrapper'>
        <header>
          <h1>Frames</h1>
        </header>
        <section className='c-frame-viewer__actions'>
          <div className='c-frame-viewer__actions-frames'>
            <Button name='first' onClick={handleFramesButtonClick} />
            <Button name='middle' onClick={handleFramesButtonClick} />
            <Button name='last' onClick={handleFramesButtonClick} />
          </div>
          <div className='c-frame-viewer__action-copy-wrapper'>
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
        : isError.error ? renderErrorView() : renderFrameView(visibleFrames, columns, frames)
    }
  </section>
};

export default FramesViewer;
