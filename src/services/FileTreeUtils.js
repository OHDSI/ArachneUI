import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';

class FileTreeUtils {

  static joinPathParts(list) {
    return list.join(this.PATH_SEPARATOR).replace(/\/+/g, '/');
  }

  static getFileFolder(filepath) {
    return filepath.replace(/(^|\/)[^\/]+$/, '') || this.PATH_SEPARATOR;
  }

  static findNodeByPath(tree, path, returnChain = false) {
    const pathPartList = path.split(this.PATH_SEPARATOR).filter(el => el.length);

    const result = [tree];
    for (const key in pathPartList) {
      const pathPart = pathPartList[key];
      const lastNode = last(result);
      if (lastNode && Array.isArray(lastNode.children)) {
        result.push(lastNode.children.find(item => item.name === pathPart));
      } else {
        break;
      }
    }

    return returnChain ? result : last(result);
  }

  static getTreeWithUpdatedNodeProps(
    origTree = { name: this.PATH_SEPARATOR, children: [] },
    path = this.PATH_SEPARATOR,
    newParams
  ) {
    const tree = cloneDeep(origTree);
    const treeNode = this.findNodeByPath(tree, path);

    Object.keys(newParams).forEach((key) => {
      treeNode[key] = newParams[key];
    });

    return tree;
  }

  static getNotLoadedNodes(tree, path) {
    const nodeList = this.findNodeByPath(tree, path, true);
    const pathToLoadList = [];

    nodeList.reduce(
      (parentPath, node) => {
        const curPath = parentPath + this.PATH_SEPARATOR + node.name;
        if (!node.loaded) {
          pathToLoadList.push(curPath);
        }
        return curPath;
      },
      ''
    );

    return pathToLoadList;
  }

}

FileTreeUtils.PATH_SEPARATOR = '/';

export default FileTreeUtils;
