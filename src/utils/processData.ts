// src/utils/processData.ts
//@ts-nocheck

import _ from "lodash";

const processData = (content: any, selectedMenu: any, prefix: string, prefixToDelete: string): any => {
  if (!content || !_.isObject(content)) {
    return content;
  }

  const newContent = _.cloneDeep(content);
  const newSelectedMenu = _.cloneDeep(selectedMenu);

  _.forIn(newContent, function (value, key) {
    if (typeof value === "string") {
      if (value.includes(prefixToDelete)) {
        newContent[key] = value.replace(prefixToDelete, prefix);
      }
    } else if (_.isObject(value)) {
      newContent[key] = processData(value, newSelectedMenu, prefix, prefixToDelete);
    }
  });

  return newContent;
};

export default processData;
