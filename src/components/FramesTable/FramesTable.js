import React from 'react';

const renderTableHeader = names => {
  const getDisplayName = name => name.replace('$', '').match(/[A-Z][a-z]+/g).join(' ');

  return <thead>
    <tr>
      {names.map(name => <th key={name}>{getDisplayName(name)}</th>)}
    </tr>
  </thead>;
};

const renderFrameRow = ({ frameId, content }, columns) => {
  return <tr key={frameId}>
    {columns.map(columnName => <td key={columnName}>{content[columnName]}</td>)}
  </tr>;
}

const renderTableBody = (frames, columns) => {
  const framesArray = Array.isArray(frames) ? frames : [frames];
  console.log(framesArray)

  return <tbody>
    {framesArray.length > 0 ? framesArray.map(frame => renderFrameRow(frame, columns)) : ''}
  </tbody>
}


const FramesTable = ({ visibleFramesList: frames, columnNamesList: columns }) => {
  return <table>
    {renderTableHeader(columns)}
    {renderTableBody(frames, columns)}
  </table>
};

export default FramesTable;
