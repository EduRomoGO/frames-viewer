import React, { useEffect } from 'react';
import { mockFetch } from '../back-end/server.js';

const fetchData = () => {
  mockFetch('/variants')
    .then(console.log)
    .catch(err => console.log(err))
}

const FramesViewer = () => {
  useEffect(() => {
    fetchData()
      // .then(processData)
      // .then(frames => setFrames(frames))
      // .catch(err => { throw new Error(err) });

  }, []);

  return <section className='c-frames-viewer'>
    fv
  </section>
};

export default FramesViewer;
