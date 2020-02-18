import React, { useEffect, useState } from 'react';
import { mockFetch } from '../back-end/server.js';

const toCamelCaseStr = key => {
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
  const [first, ...rest] = key.split('_');

  return first + (rest.length > 0 ? rest.reduce((acc, next) => acc + capitalize(next), '') : '');
}

const toCamelCaseData = data => {
  let dataCamelCased = data;

  const getNextValue = value => {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => getNextValue(item));
      } else {
        return toCamelCaseData(value);
      }
    } else {
      return value;
    }
  };


  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      dataCamelCased = data.map(item => getNextValue(item));
    } else {
      dataCamelCased = Object.keys(data)
        .reduce(
          (newObj, next) => ({ ...newObj, [toCamelCaseStr(next)]: getNextValue(data[next]) }),
          {});
    }
  } else {
    dataCamelCased = data;
  }

  return dataCamelCased;
};

// Im doing this previous to the camelCase transform so it is faster
// I am assuming here that I already know in advance the structure of the object and where to look for props that I am interested in, it also serves as a place to hide where is this info so if the implementation changes, only this function needs to be modified
const retrieveFrames = variant => {
  return variant.body.creative_list[0].working_data.frames;
};

const processVariant = (variant) => {
  const frames = retrieveFrames(variant);
  const framesCamelCased = toCamelCaseData(frames);
  console.log(frames)
  console.log(framesCamelCased)

  return framesCamelCased;
};

// Im doing this previous to the camelCase transform so it is faster
const retrieveInterestingData = columns => {
  return columns.body
    .filter(item => item.is_hidden === false)
    .map(({ id, parent_frame_id, size_id, key_name }) => ({ id, parent_frame_id, size_id, key_name }));
}

const processColumns = columns => {
  const subColumns = retrieveInterestingData(columns);
  const subColumnsCamelCase = toCamelCaseData(subColumns);

  console.log(subColumns);
  console.log(subColumnsCamelCase);

  return subColumnsCamelCase;
}


const processData = (endpoint, data) => {
  const endpointMap = {
    '/variant': () => processVariant(data),
    '/columns': () => processColumns(data),
  };

  return endpointMap[endpoint]();
};


// procesar los datos
// pintar la tabla


const FramesViewer = () => {
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
        console.log(err);
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


  return <section className='c-frames-viewer'>
    {
      isLoading
        ? renderLoadingView()
        : isError.error ? renderErrorView() : 'fv'
    }
  </section>
};

export default FramesViewer;
