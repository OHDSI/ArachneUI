import mimeTypes from 'const/mimeTypes';

const itemsComparator = (a, b) => (a.docType === b.docType) ? a.name.localeCompare(b.name) : (a.docType === mimeTypes.folder ? -1 : 1);

function toFileTree(files) {
  const nodes = [];
  files?.forEach(f => {
    const path = f.path && f.path.split('/');
    const filename = path.pop();
    const file = {
      name: filename,
      docType: mimeTypes.txt,
      relativePath: path,
      ...f
    };
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
        parent.push(foundNode);
      }
      parent = foundNode.children.sort(itemsComparator);
    });
    parent.push(file);
  });
  return nodes.sort(itemsComparator);
}

export {toFileTree};