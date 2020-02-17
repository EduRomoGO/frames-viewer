import React, { useEffect } from 'react';
import { mockFetch } from '../back-end/server.js';

// I am assuming here that I already know in advance the structure of the object and where to look for props that I am interested in, it also serves as a place to hide where is this info so if the implementation changes, only this function needs to be modified
const retrieveFrames = variant => {
  return variant.body.creative_list[0].working_data.frames;
};

const processColumns = columns => {
  return columns;
}

const processData = ([variant, columns]) => {
  const frames = retrieveFrames(variant);
  const cleanColumns = processColumns(columns);

  console.log(frames);
  console.log(cleanColumns);
};

// recuperar datos (columns y variant)
// procesar los datos
// almacenarlos en el estado
// pintar la tabla

const fetchData = () => {
  return Promise.all([mockFetch('/variant'), mockFetch('/columns')]);
};

const FramesViewer = () => {
  useEffect(() => {
    fetchData()
      .then(processData)
      // .then(frames => setFrames(frames))
      // .catch(err => { throw new Error(err) });

  }, []);

  return <section className='c-frames-viewer'>
    fv
  </section>
};

export default FramesViewer;
