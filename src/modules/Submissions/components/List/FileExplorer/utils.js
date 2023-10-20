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
    let parentPath = "";
    path.filter(s => s !== filename).forEach(segment => {
      let foundNode = parent?.find(item => item.name === segment && item.docType === mimeTypes.folder);
      if (!foundNode) {
        foundNode = {
          name: segment,
          docType: mimeTypes.folder,
          children: [],
          isExpanded: false,
          path: parentPath + "/" + segment,
        }
        parent.push(foundNode);
      }
      parent = foundNode.children.sort(itemsComparator);
      parentPath = foundNode.path;
    });
    parent.push(file);
  });
  return nodes.sort(itemsComparator);
}

function findNodeByPath(files, path) {
  const folders = path.split("/").filter(p => p !== "");
  let parent = files;
  let found = null;
  folders.forEach(seg => {
    found = parent.find(item => item.name === seg && item.docType === mimeTypes.folder);
    parent = found.children;
  });
  return found;
}

export {toFileTree, findNodeByPath};