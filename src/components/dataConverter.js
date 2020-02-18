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

  return subColumnsCamelCase;
}


export const processData = (endpoint, data) => {
  const endpointMap = {
    '/variant': () => processVariant(data),
    '/columns': () => processColumns(data),
  };

  return endpointMap[endpoint]();
};
