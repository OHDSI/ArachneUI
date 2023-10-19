import mimeTypes from 'const/mimeTypes';

function itemsComparator(a, b) {
  if (a.docType === b.docType) {
    return a.name.localeCompare(b.name);
  } else if (a.docType === mimeTypes.folder) {
    return -1;
  } else {
    return 1;
  }
}

function toFileTree(files) {
  const nodes = [];
  files?.forEach(f => {
    const path = f.path && f.path.split('/');
    const filename = path.pop();
    const file = {
      name: filename,
      docType: "text",
      relativePath: path,
      ...f
    };
    if (path.length > 0) {
      let parent = nodes;
      path.filter(s => s !== filename).forEach(segment => {
        let foundNode = parent?.find(item => item.name === segment && item.docType === mimeTypes.folder);
        if (!foundNode) {
          foundNode = {
            name: segment,
            docType: mimeTypes.folder,
            children: [],
            isExpanded: true,
          }
          nodes.push(foundNode);
        }
        parent = foundNode;
      });
      parent.children.push(file);
    } else {
      nodes.push(file);
    }
  });
  return nodes.sort(itemsComparator);
}

export {toFileTree};