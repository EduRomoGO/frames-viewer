import React, { useEffect, useState } from 'react';
import { mockFetch } from '../back-end/server.js';
import FramesTable from './FramesTable/FramesTable.js';
import { processData } from './dataConverter.js';


const FramesViewer = () => {
  const [visibleFrames, setVisibleFrames] = useState('first');
  const [variant, setVariant] = useState({});
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
    }


    fetchData();
  }, []);

  function fetchEndpointData(endpoint) {
    return mockFetch(endpoint)
      .then(data => processData(endpoint, data))
      .then(data => {
        if (endpoint === '/variant') {
          setVariant(data);
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

  const renderFrameView = (visibleFrames, columns, variant) => {
    if (visibleFrames && columns.length && Object.keys(variant).length > 0) {
      return <section className='c-frame-view'>
        <header>
          <h1>Frames</h1>
        </header>
        <FramesTable variant={variant} columns={columns} visibleFrames={visibleFrames} />
      </section>
    } else {
      return '';
    }
  };


  return <section className='c-frames-viewer'>
    {
      isLoading
        ? renderLoadingView()
        : isError.error ? renderErrorView() : renderFrameView(visibleFrames, columns, variant)
    }
  </section>
};

export default FramesViewer;
