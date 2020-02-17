import React, { useEffect, useState } from 'react';
import { mockFetch } from '../back-end/server.js';

// I am assuming here that I already know in advance the structure of the object and where to look for props that I am interested in, it also serves as a place to hide where is this info so if the implementation changes, only this function needs to be modified
const retrieveFrames = variant => {
  return variant.body.creative_list[0].working_data.frames;
};

const processColumns = columns => {
  return columns;
}

const processData = (variant) => {
  // const processData = ([variant, columns]) => {
  const frames = retrieveFrames(variant);
  // const cleanColumns = processColumns(columns);

  console.log(frames);
  // console.log(cleanColumns);
};

// recuperar datos (columns y variant)
// procesar los datos
// almacenarlos en el estado
// pintar la tabla

const fetchData = () => {
  return Promise.all([mockFetch('/variant'), mockFetch('/columns')]);
};


const FramesViewer = () => {
  const [isError, setIsError] = useState({
    endpoints: [],
    error: false,
  });
  useEffect(() => {
    // fetchData()

    fetchVariant();
    // if (error.isError && error.endpoints[])
    // .then(frames => setFrames(frames))
    // .catch(err => { throw new Error(err) });

  }, []);

  function fetchVariant() {
    mockFetch('/variant')
      .catch(err => {
        console.log(err);
        setIsError(state => {
          return {
            error: true,
            endpoints: [
              ...state.endpoints,
              {
                name: '/variant',
                status: err.status,
              },
            ],
          };
        });
      });
    // .then(processData)
    // .catch(error => setIsError(state => {
    //   return { error: true, api: ['/variant']};
    // }));
  }

  return <section className='c-frames-viewer'>
    {isError ? <div>an error happened</div> : 'fv'}
  </section>
};

export default FramesViewer;
