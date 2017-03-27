import * as React from 'react';
import * as d3 from 'd3-force';
import * as d3select from 'd3-selection';
import * as d3transition from 'd3-transition';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

type GraphNode = {
  id: string;
  x?: number;
  y?: number;
  weight?: number;
};

type GraphConnection = {
  source: string;
  target: string;
};

type GraphLink = {
  source: GraphNode;
  target: GraphNode;
};

interface ITermConnectionsProps {
  terms: Array<GraphNode>;
  links: Array<GraphConnection | GraphLink>;
};

interface IGraph extends ITermConnectionsProps {
  container: SVGElement;
};

function updateGraph(graph: IGraph) {
  const {
    container,
    terms,
    links,
  } = graph;
  // Update the nodes…
  let node = d3select.select(container).selectAll("circle")
    .data(terms, (d: GraphNode) => d.x);

  // Update the links…
  let link = d3select.select(container).selectAll("line")
      .data(links, (d: GraphLink) => d.target.x);

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
      .attr("class", "link")
      .attr("x1", (d: GraphLink) => d.source.x)
      .attr("y1", (d: GraphLink) => d.source.y)
      .attr("x2", (d: GraphLink) => d.target.x)
      .attr("y2", (d: GraphLink) => d.target.y);

  // Enter any new nodes.
  node.enter().insert("svg:circle")
      .attr("class", "node")
      .attr("cx", (d: GraphNode) => d.x)
      .attr("cy", (d: GraphNode) => d.y)
      .attr("r", (d: GraphNode) => d.weight || 4.5);


  // Exit any old links.
  link.exit().remove();
  // Exit any old nodes.
  node.exit().remove();
}

function printGraph(container: SVGElement, terms: Array<GraphNode>, links: Array<GraphLink>) {
  let width: number, height: number;
  width = container.getBoundingClientRect().width,
  height = container.getBoundingClientRect().height;

  const simulation = d3.forceSimulation(terms);
  simulation
    .on("tick", updateGraph.bind(null, {
      container,
      terms,
      links,
    }))
    .force('link', d3.forceLink(links).id((d: GraphNode) => d.id))
    .force('center', d3.forceCenter(width/2, height/2))
    .force('charge', d3.forceManyBody());
}

function TermConnections(props: ITermConnectionsProps) {
  const { terms, links } = props;
  const classes = BEMHelper('term-connections');

  return <svg
    {...classes()}
    ref={element => {
      if (element) {
        printGraph(element, terms, links);
      }
    }}
  ></svg>;
}

export default TermConnections;
export {
  ITermConnectionsProps,
  GraphNode,
  GraphConnection,
  GraphLink,
};
