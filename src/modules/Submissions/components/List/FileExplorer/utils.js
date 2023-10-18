import mimeTypes from 'const/mimeTypes';

function toFileTree(files) {
		let nodes = [];
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
								let foundNode = parent.find(item => item.name === segment && item.docType === mimeTypes.folder);
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
		return nodes;
}

export { toFileTree };