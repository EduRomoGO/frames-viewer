import React from 'react';


const allColumnNames = columns => [...new Set(columns.map(({ keyName }) => keyName))];

const renderTableHeader = names => {
  const getDisplayName = name => name.replace('$', '').match(/[A-Z][a-z]+/g).join(' ');

  return <thead>
    <tr>
      {names.map(name => <th key={name}>{getDisplayName(name)}</th>)}
    </tr>
  </thead>;
};

const getColumnsFor = (frameId, columns) => {
  return columns.filter(({ parentFrameId }) => parentFrameId === frameId);
}

const renderFrameRow = ({ frameId, content }, columns) => {
  const getData = columnName => allColumnNames(getColumnsFor(frameId, columns)).includes(columnName) ? content[columnName] : '';

  // content.filter(item => isItemInColumns)

  return <tr key={frameId}>
    {allColumnNames(columns).map(columnName => <td key={columnName}>{getData(columnName)}</td>)}
  </tr>;
}

const renderTableBody = (frames, columns) => {
  const framesArray = Array.isArray(frames) ? frames : [frames];

  return <tbody>
    {framesArray.length > 0 ? framesArray.map(frame => renderFrameRow(frame, columns)) : ''}
  </tbody>
}


const FramesTable = ({ variant, columns, visibleFrames }) => {
  return <table>
    {renderTableHeader(allColumnNames(columns))}
    {renderTableBody(variant[visibleFrames], columns)}
  </table>
};

export default FramesTable;
