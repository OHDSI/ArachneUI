import * as React from 'react';
import * as d3 from 'd3-force';
import { Simulation } from 'd3-force';
import * as d3select from 'd3-selection';
import { event } from 'd3-selection';
import * as d3drag from 'd3-drag';
import BEMHelper from 'services/BemHelper';
import * as d3hierarchy from 'd3-hierarchy';
import * as d3zoom from 'd3-zoom';
import * as d3transition from 'd3-transition';

require('./style.scss');

type GraphNode = {
  id: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  weight?: number;
  isCurrent?: boolean;
  name: string;
};

type GraphConnection = {
  source: string;
  target: string;
};

type GraphLink = {
  source: GraphNode;
  target: GraphNode;
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
function diagonal(s, d) {
  const path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`

  return path;
}

function dragstarted(c) {
  c.initialX = event.x;
  c.initialY = event.y;
}

function dragged(c) {
  const diffX = event.x - c.initialX;
  const diffY = event.y - c.initialY;
  c.attr('transform', `translate(${c.fixedX + diffX}, ${c.fixedY + diffY}) scale(${c.scaleFactor})`);
  c.tempX = c.fixedX + diffX;
  c.tempY = c.fixedY + diffY;
}

function dragended(c) {
  c.fixedX = c.tempX;
  c.fixedY = c.tempY;
}

function zoomed(c, transformOrigin) {
  if (event.transform.k > 3 || event.transform.k < 0.25) {
    return false;
  }
  c.transition(d3transition.transition().duration(100))
    .attr('style',
      `transform-origin:
      ${event.sourceEvent.offsetX * event.transform.k}px
      ${event.sourceEvent.offsetY * event.transform.k}px`)
    .attr('transform', `translate(${c.fixedX}, ${c.fixedY}) scale(${event.transform.k})`);
  c.scaleFactor = event.transform.k;
}

function updateTree(treemap, root, container, redirect) {
  const treeData = treemap(root);
  const terms = treeData.descendants();
  const links = treeData.descendants().slice(1);
  const rectHeight = 25;
  const rectWidth = 100;

  const nodes = container.selectAll('g.node')
    .data(terms, d => { 
      return d.data.id
    });

  const nodesEnter = nodes
    .enter();
  const wrappers = nodesEnter.append('svg:g')
    .attr('class', 'node')
    .attr('transform', (d: GraphNode) => {
      // swap x and y to lay the tree horizontally
      return `translate(${d.y + root.XDisplace}, ${d.x - rectHeight/2})`
    })
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .on('click', (d: GraphNode) => redirect(d.id));
  wrappers.append('svg:rect')    
    .attr('class', (d: GraphNode) => d.isCurrent ? 'nodeWrapper current' : 'nodeWrapper')
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .attr('rx', 7.5)
    .attr('ry', 7.5);
  wrappers.append("svg:text")
    .text((d: GraphNode) => `${d.data.name}`)
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .attr('x', 10)
    .attr('y', 16);

  const nodesDiff = nodesEnter.merge(nodes);

  const connections = container.selectAll("path.link")
    .data(links, d => d.data.id)
    .enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('marker-end', 'url(#end)')
    .transition(d3transition.transition().duration(1000))
    .attr('d', (d) => {
      const from = {x: d.parent.x, y: d.parent.y + root.XDisplace + rectWidth}
      const to = {x: d.x, y: d.y + root.XDisplace};
      return diagonal(from, to);
    });

  nodesDiff
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

  let levels = new Set();
  terms.forEach(term => levels.add(term.parent));

  const svg = d3select
    .select(container);
  const treeWrapper = svg.selectAll('g#wrapper');
  treeWrapper.scaleFactor = 1;
  treeWrapper.fixedX = 0;
  treeWrapper.fixedY = 0;

  const drag = d3drag.drag()
    .on("drag", dragged.bind(null, treeWrapper))
    .on("start", dragstarted.bind(null, treeWrapper))
    .on("end", dragended.bind(null, treeWrapper));
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

  const structure = d3hierarchy.stratify()
    .id((d: GraphNode) => d.id)
    .parentId((d: GraphNode) => d.parent)(terms);
  // initial left padding 
  structure.XDisplace = 50;

  const tree = d3hierarchy.tree().size([height, levels.size * gapWidth]);

  updateTree(tree, structure, treeWrapper, redirect);

}

function TermConnections(props: ITermConnectionsProps) {
  const { terms, links, goToTerm } = props;
  const classes = BEMHelper('term-connections');

  return <svg
    {...classes()}
    ref={element => {
      if (element) {
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
  GraphLink,
};
