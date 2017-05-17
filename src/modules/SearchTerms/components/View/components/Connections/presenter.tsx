import * as React from 'react';
import * as d3 from 'd3-force';
import * as d3select from 'd3-selection';
import { event } from 'd3-selection';
import * as d3drag from 'd3-drag';
import BEMHelper from 'services/BemHelper';
import * as d3zoom from 'd3-zoom';
import * as d3transition from 'd3-transition';
import * as d3force from 'd3-force';

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
  depth: number;
  yDepth: number;
};

type GraphConnection = {
  id?: number;
  source: number;
  target: number;
};

type GraphLink = {
  id?: number;
  source: GraphNode;
  target: GraphNode;
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

interface ITermConnectionsStateProps {
  terms: Array<GraphNode>;
  links: Array<GraphConnection>;
};

interface ITermConnectionsDispatchProps {
  goToTerm: (id: number) => any;
};

interface ITermConnectionsProps extends ITermConnectionsStateProps, ITermConnectionsDispatchProps {
};

// Creates a curved (diagonal) path from parent to the child nodes
function diagonal(startPoint: Point, endPoint: Point, isDirectedBack: boolean) {
  // we should add bias to bezier points to make the arrow look accordingly (if it points backwards)
  const bezierYDisplace = isDirectedBack ? 300 : 0;
  const path = `M ${startPoint.x} ${startPoint.y}
          C ${(startPoint.x + endPoint.x) / 2 + bezierYDisplace} ${startPoint.y},
            ${(startPoint.x + endPoint.x) / 2 - bezierYDisplace} ${endPoint.y},
            ${endPoint.x} ${endPoint.y}`

  return path;
}

function dragstarted(canvas: ICanvas) {
  canvas.initialX = event.x;
  canvas.initialY = event.y;
}

function dragged(canvas: ICanvas) {
  const diffX = event.x - canvas.initialX;
  const diffY = event.y - canvas.initialY;
  const x = canvas.fixedX + diffX;
  const y = canvas.fixedY + diffY;
  const scale = canvas.scaleFactor;
  if (isNaN(x) || isNaN(y) || isNaN(scale)) {
    return false;
  }
  canvas
    .attr(
      'transform',
      `translate(${x}, ${y}) scale(${scale})`
      );
  canvas.tempX = x;
  canvas.tempY = y;
}

function dragended(canvas: ICanvas) {
  canvas.fixedX = canvas.tempX;
  canvas.fixedY = canvas.tempY;
}

function zoomed(canvas: ICanvas) {
  const maxZoom = 3;
  const minZoom = 0.25;
  if (event.transform.k > maxZoom || event.transform.k < minZoom) {
    return false;
  }
  const x = canvas.fixedX;
  const y = canvas.fixedY;
  const scale = event.transform.k;
  if (isNaN(x) || isNaN(y) || isNaN(scale)) {
    return false;
  }
  canvas.transition(d3transition.transition('zoom').duration(100))
    /*.attr('style',
      `transform-origin:
      ${event.sourceEvent.offsetX * event.transform.k}px
      ${event.sourceEvent.offsetY * event.transform.k}px`)*/
    .attr('transform', `translate(${x}, ${y}) scale(${scale})`);
  canvas.scaleFactor = scale;
}

function updateSimulation(
  concepts,
  connections,
  nodeWidth,
  nodeHeight,
  gap
) {
  connections
    .attr('d', (c: GraphLink) => {
      const from = {
        x: c.source.x + nodeWidth,
        y: c.source.y + nodeHeight/2
      }
      const to = {
        x: c.target.x,
        y: c.target.y + nodeHeight/2
      };
      return diagonal(from, to, c.source.depth <= c.target.depth);
    });

  concepts
    .attr('transform', (d: GraphNode) => {
      return `translate(${d.x}, ${d.y})`;
    });
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
  const gapWidth = 100;
  const rectHeight = 25;
  const rectWidth = 250;
  const conceptNameHeight = 40;
  const maxNameLength = 30;
  const conceptNameLeftPadding = 10;
  const conceptNameTopPadding = 25;
  const conceptBorderRadius = 7.5;
  const conceptLeftPadding = 10;
  const conceptTopPadding = 16;
  let captionTransitionTimeout;

  const svg = d3select
    .select(container);   

  const treeWrapper: any = svg.selectAll('g#wrapper');
  treeWrapper.scaleFactor = 1;
  treeWrapper.fixedX = 0;
  treeWrapper.fixedY = 0;

  // hint with the concept name
  svg.selectAll('g#concept-name').attr('transform', `translate(0, ${height-conceptNameHeight})`);
  svg.selectAll('rect#concept-name-bg')
    .attr('class', 'wrapper')
    .attr('width', width)
    .attr('height', conceptNameHeight);
  const conceptName = svg.selectAll('text#concept-name-text')
    .attr('x', conceptNameLeftPadding)
    .attr('y', conceptNameTopPadding);

  // interactivity
  const drag = d3drag.drag()
    .on('drag', dragged.bind(null, treeWrapper))
    .on('start', dragstarted.bind(null, treeWrapper))
    .on('end', dragended.bind(null, treeWrapper));
  const zoom = d3zoom.zoom()
    .on('zoom', zoomed.bind(null, treeWrapper))

  svg
    .call(drag)
    .call(zoom);

  // arrow
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

  const termsFixed = terms.map((concept: GraphNode) => ({
    ...concept,
    fy: (height - rectHeight)/2 + concept.yDepth * gapWidth,
    fx: (width - rectWidth)/2 - concept.depth * (rectWidth + gapWidth)
  }));
  const concepts = treeWrapper
    .selectAll('g.node')
    .data(termsFixed, (d: any) => d.id);
  // remove all nodes
  concepts
    .exit()
    .remove();

  const wrappers = concepts
    .enter()
    .append('svg:g')
    .attr('class', 'node')
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .on('click', (d: GraphNode) => redirect(d.id))
    .on('mouseover', (d: GraphNode) => {
      clearTimeout(captionTransitionTimeout);
      conceptName.text(d.name);
    })
    .on('mouseout', (d: GraphNode) => {
      captionTransitionTimeout = setTimeout(() => conceptName.text(''), 300) }
    );
  wrappers.append('svg:rect')    
    .attr('class', (d: GraphNode) => d.isCurrent ? 'nodeWrapper current' : 'nodeWrapper')
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .attr('rx', conceptBorderRadius)
    .attr('ry', conceptBorderRadius);
  wrappers.append('svg:text')
    .text((d: GraphNode) => `${d.name.substr(0, maxNameLength)}...`)
    .attr('height', rectHeight)
    .attr('width', rectWidth)
    .attr('x', conceptLeftPadding)
    .attr('y', conceptTopPadding);

  const connections = treeWrapper.selectAll('path.link')
    .data(links);
  // remove all connections
  connections
    .exit()
    .remove();
  const connectors = connections
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('marker-end', 'url(#end)')
    .attr('data-from', (c: any) => c.source.id)
    .attr('data-to', (c: any) => c.target.id);

  // fix y coordinates for concepts

  const simulation = d3force
    .forceSimulation(termsFixed)
    .force('collide', d3.forceCollide().radius(d => rectHeight).iterations(2))
    .force('link', d3.forceLink(links).id((d: GraphNode) => d.id.toString()).distance(rectWidth).strength(1))
    .force('center', d3.forceCenter(height/2, width/2))
    .on('tick', updateSimulation.bind(
      null,
      wrappers,
      connectors,
      rectWidth,
      rectHeight,
      gapWidth
    ));
  simulation.restart();
}

function TermConnections(props: ITermConnectionsProps) {
  const { terms, links, goToTerm } = props;
  const classes = BEMHelper('term-connections');

  return <svg
    {...classes()}
    ref={element => {
      if (element && terms) {
        printGraph(element, terms, links, goToTerm);
      }
    }}
  >
    <g id='wrapper'></g>
    <g id='concept-name'>
      <rect id='concept-name-bg'></rect>
      <text id='concept-name-text'></text>
    </g>
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
