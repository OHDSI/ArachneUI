import * as React from 'react';
import * as d3 from 'd3-force';
import { Simulation } from 'd3-force';
import * as d3select from 'd3-selection';
import { event } from 'd3-selection';
import * as d3drag from 'd3-drag';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

type GraphNode = {
  id: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
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
  links: Array<GraphConnection>;
};

interface IGraph {
  container: SVGElement;
  terms: any;
  connections: any;
};

function dragstarted(simulation: Simulation<GraphNode, GraphLink>, d: GraphNode) {
  if (!event.active)
    simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(simulation: Simulation<GraphNode, GraphLink>, d: GraphNode) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(simulation: Simulation<GraphNode, GraphLink>, d: GraphNode) {
  if (!event.active)
    simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function updateGraph(graph: IGraph) {
  const {
    container,
    terms,
    connections,
  } = graph;
  connections
      .attr("x1", (d: GraphLink) => d.source.x)
      .attr("y1", (d: GraphLink) => d.source.y)
      .attr("x2", (d: GraphLink) => d.target.x)
      .attr("y2", (d: GraphLink) => d.target.y);

  terms
      .attr("cx", (d: GraphNode) => d.x)
      .attr("cy", (d: GraphNode) => d.y);

}

function printGraph(container: SVGElement, terms: Array<GraphNode>, links: Array<GraphConnection>) {
  let width: number, height: number;
  width = container.getBoundingClientRect().width,
  height = container.getBoundingClientRect().height;

  const simulation = d3.forceSimulation(terms);

  const drag = d3drag.drag()
    .on("start", dragstarted.bind(null, simulation))
    .on("drag", dragged.bind(null, simulation))
    .on("end", dragended.bind(null, simulation));

  simulation
    .force('link', d3.forceLink(links).id((d: GraphNode) => d.id))
    .force('center', d3.forceCenter(width/2, height/2))
    .force('charge', d3.forceManyBody());

  let nodes = d3select.select(container).selectAll("circle")
    .data(terms, (d: GraphNode) => d.x.toString())
    .enter()
    .insert("svg:circle", ".node")
    .attr("class", "node")
    .attr("r", (d: GraphNode) => d.weight || 4.5)
    .call(drag);

  let connections = d3select.select(container).selectAll("line")
    .data(links)
    .enter().insert("svg:line", ".node")
    .attr("class", "link");

  simulation.on("tick", updateGraph.bind(null, {
    container,
    terms: nodes,
    connections,
  }));
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
