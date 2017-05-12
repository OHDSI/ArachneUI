import * as React from 'react';
import * as d3 from 'd3-force';
import * as d3select from 'd3-selection';
import { event } from 'd3-selection';
import * as d3drag from 'd3-drag';
import BEMHelper from 'services/BemHelper';
import * as d3hierarchy from 'd3-hierarchy';
import * as d3zoom from 'd3-zoom';
import * as d3transition from 'd3-transition';

require('./style.scss');

type Point = {
  x: number;
  y: number;
};

type GraphNode = {
  id: number;
  x: number;
  y: number;
  isCurrent?: boolean;
  name: string;
  parentIds?: Array<number>;
};

type GraphConnection = {
  source: number;
  target: number;
  select?: any;
};

interface ICanvas extends d3select.Selection<d3select.BaseType, {}, SVGElement, {}> {
  initialX: number;
  initialY: number;
  fixedX: number;
  fixedY: number;
  tempX: number;
  tempY: number;
  scaleFactor: number;
};

interface IConcept extends d3hierarchy.HierarchyPointNode<{}> {
  data: GraphNode;
};

interface IHierarchy extends d3hierarchy.HierarchyNode<{}> {
  XDisplace: number;
};

interface IGraphLink extends d3hierarchy.HierarchyPointNode<{}> {
  id: string;
  data: {
    id: string;
  };
  x: number;
  y: number;
  parent: IConcept;
};

interface ITermConnectionsStateProps {
  terms: Array<GraphNode>;
  links: Array<GraphConnection>;
};

interface ITermConnectionsDispatchProps {
  goToTerm: (id: number) => any;
};

interface ITermConnectionsProps extends ITermConnectionsStateProps, ITermConnectionsDispatchProps {
};

interface IGraph {
  container: SVGElement;
  terms: any;
  connections: any;
};

// Creates a curved (diagonal) path from parent to the child nodes
function diagonal(startPoint: Point, endPoint: Point, isDirectedBack: boolean = false) {
  const bezierYDisplace = isDirectedBack ? 150 : 0;
  const path = `M ${startPoint.y} ${startPoint.x}
          C ${(startPoint.y + endPoint.y) / 2 + bezierYDisplace} ${startPoint.x},
            ${(startPoint.y + endPoint.y) / 2 - bezierYDisplace} ${endPoint.x},
            ${endPoint.y} ${endPoint.x}`

  return path;
}

function dragstarted(canvas: ICanvas) {
  canvas.initialX = event.x;
  canvas.initialY = event.y;
}

function dragged(canvas: ICanvas) {
  const diffX = event.x - canvas.initialX;
  const diffY = event.y - canvas.initialY;
  canvas
    .attr(
      'transform',
      `translate(${canvas.fixedX + diffX}, ${canvas.fixedY + diffY}) scale(${canvas.scaleFactor})`
      );
  canvas.tempX = canvas.fixedX + diffX;
  canvas.tempY = canvas.fixedY + diffY;
}

function dragended(canvas: ICanvas) {
  canvas.fixedX = canvas.tempX;
  canvas.fixedY = canvas.tempY;
}

function zoomed(canvas: ICanvas) {
  if (event.transform.k > 3 || event.transform.k < 0.25) {
    return false;
  }
  canvas.transition(d3transition.transition('zoom').duration(100))
    /*.attr('style',
      `transform-origin:
      ${event.sourceEvent.offsetX * event.transform.k}px
      ${event.sourceEvent.offsetY * event.transform.k}px`)*/
    .attr('transform', `translate(${canvas.fixedX}, ${canvas.fixedY}) scale(${event.transform.k})`);
  canvas.scaleFactor = event.transform.k;
}

function mouseover(canvas: ICanvas, d: IConcept) {
  canvas
    .selectAll(`path.link[data-from="${d.id}"], path.link[data-to="${d.id}"]`)
    .attr('class', 'link hover');
}
function mouseout(canvas: ICanvas) {
  canvas
    .selectAll(`path.link.hover`)
    .attr('class', 'link');
}

function updateTree(
  treemap: d3hierarchy.TreeLayout<{}>,
  root: IHierarchy,
  additionalLinks: Array<GraphConnection>,
  container: ICanvas,
  redirect: Function
) {
  const treeData = treemap(root);
  const terms = treeData.descendants();
  const links = treeData.descendants().slice(1);
  const rectHeight = 25;
  const rectWidth = 100;

  const nodes = container
    .selectAll('g.node')
    .data(terms, (d: any) => d.data.id);
  const nodesEnter = nodes.enter();
  const wrappers = nodesEnter
    .append('svg:g')
    .attr('class', 'node')
    .attr('transform', (d: IConcept) => {
      // swap x and y to lay the tree horizontally
      return `translate(${d.y + root.XDisplace}, ${d.x - rectHeight/2})`
    })
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .on('click', (d: IConcept) => redirect(d.id));
  wrappers.append('svg:rect')    
    .attr('class', (d: IConcept) => d.data.isCurrent ? 'nodeWrapper current' : 'nodeWrapper')
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .attr('rx', 7.5)
    .attr('ry', 7.5);
  wrappers.append('svg:text')
    .text((d: IConcept) => `${d.data.name}`)
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .attr('x', 10)
    .attr('y', 16);

  const nodesDiff = nodesEnter.merge(nodesEnter);

  const connections = container.selectAll('path.link')
    .data(links, (c: IGraphLink) => c.data.id)
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('marker-end', 'url(#end)')
    .attr('data-from', (c: any) => c.parent.id)
    .attr('data-to', (c: any) => c.id)
    .attr('d', (c: any) => {
      const from = {x: c.parent.x, y: c.parent.y + root.XDisplace + rectWidth}
      const to = {x: c.x, y: c.y + root.XDisplace};
      return diagonal(from, to);
    });

  nodesDiff
    .exit()
    .remove();

  wrappers  
    .on('mouseover', mouseover.bind(null, container))
    .on('mouseout', mouseout.bind(null, container));

  // draw links to emulate multi-parent layout
  const additionalConnections = additionalLinks.map((link: GraphConnection) => {
    const parent = terms.filter((d: IConcept) => d.data.id === link.source)[0];
    const child = terms.filter((d: IConcept) => d.data.id === link.target)[0];
    return {
      parent,
      child,
    };
  });
  const multiParentLinks = container.selectAll('path.additional-link')
    .data(additionalConnections)
    .enter();
  multiParentLinks.insert('path', 'g')
    .attr('class', 'link additional-link')
    .attr('marker-end', 'url(#end)')
    .attr('data-from', d => d.parent.id)
    .attr('data-to', d => d.child.id)
    .attr('d', (d) => {
      const from = {x: d.parent.x, y: d.parent.y + root.XDisplace + rectWidth}
      const to = {x: d.child.x, y: d.child.y + root.XDisplace};
      return diagonal(from, to, d.parent.y >= d.child.y);
    });

  multiParentLinks
    .exit()
    .remove();
}

function printGraph(
  container: SVGElement,
  terms: Array<GraphNode>,
  links: Array<GraphConnection>,
  redirect: Function,
 ) {
  let width: number, height: number;
  width = container.getBoundingClientRect().width,
  height = container.getBoundingClientRect().height;
  const gapWidth = 150;

  // width of the container
  let levels = new Set();
  terms.forEach(term => term.parentIds ? levels.add(term.parentIds[0]) : null);

  const svg = d3select
    .select(container);   

  const treeWrapper: any = svg.selectAll('g#wrapper');
  treeWrapper.scaleFactor = 1;
  treeWrapper.fixedX = 0;
  treeWrapper.fixedY = 0;

  const drag = d3drag.drag()
    .on('drag', dragged.bind(null, treeWrapper))
    .on('start', dragstarted.bind(null, treeWrapper))
    .on('end', dragended.bind(null, treeWrapper));
  const zoom = d3zoom.zoom()
    .on('zoom', zoomed.bind(null, treeWrapper))

  svg
    .call(drag)
    .call(zoom);

  treeWrapper.append('svg:defs').selectAll('marker')
    .data(['end'])
    .enter().append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 15 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M0,-5L15,0L0,5');

  const structure: any = d3hierarchy.stratify()
    .id((d: GraphNode) => d.id.toString())
    .parentId((d: GraphNode) => d.parentIds ? d.parentIds[0].toString() : null)(terms);
  // initial left padding 
  structure.XDisplace = 50;

  const tree = d3hierarchy.tree().size([height, levels.size * gapWidth]);

  updateTree(tree, structure, links, treeWrapper, redirect);

}

function TermConnections(props: ITermConnectionsProps) {
  const { terms, links, goToTerm } = props;
  const classes = BEMHelper('term-connections');

  return <svg
    {...classes()}
    ref={element => {
      if (element && terms.length) {
        printGraph(element, terms, links, goToTerm);
      }
    }}
  >
    <g id='wrapper'></g>
  </svg>;
}

export default TermConnections;
export {
  ITermConnectionsStateProps,
  ITermConnectionsDispatchProps,
  ITermConnectionsProps,
  GraphNode,
  GraphConnection,
};
