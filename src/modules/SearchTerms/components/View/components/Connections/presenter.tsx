import * as React from 'react';
import * as d3 from 'd3-force';
import * as d3select from 'd3-selection';
import { event } from 'd3-selection';
import * as d3drag from 'd3-drag';
import BEMHelper from 'services/BemHelper';
import * as d3zoom from 'd3-zoom';
import * as d3transition from 'd3-transition';
import * as d3force from 'd3-force';
import {
  LoadingPanel,
} from 'arachne-components';
import {
  gapWidth,
  rectHeight,
  rectWidth,
  conceptNameHeight,
  maxNameLength,
  conceptNameLeftPadding,
  conceptNameTopPadding,
  conceptBorderRadius,
  conceptLeftPadding,
  conceptTopPadding,
  maxZoom,
  minZoom,

  controlSize,
  controlsGapSize,
  zoomStep,

  circleHeight,
  circleWidth,
  circleBorderRadius,
} from 'modules/SearchTerms/const';
import { find } from 'lodash';

require('./style.scss');

type Point = {
  x: number;
  y: number;
};

type GraphNode = {
  id: number;
  x: number;
  y: number;
  fx?: number;
  fy?: number;
  isCurrent?: boolean;
  name: string;
  parentIds?: Array<number>;
  depth: number;
  yDepth: number;
  count?: number;
};

type GraphConnection = {
  id?: number;
  source: number;
  target: number;
};

type GraphLink = {
  id?: number;
  source: number;
  target: number;
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
  isInProgress: boolean;
  termFilters: any;
};

interface ITermConnectionsDispatchProps {
  goToAddress: (address: string) => any;
  goToTerm: (id: number) => any;
  setLoadingStatus: (status: boolean) => any;
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
  canvas.fixedX = canvas.tempX || 0;
  canvas.fixedY = canvas.tempY || 0;
}

function zoomed(canvas: ICanvas) {
  setZoom(canvas, event.transform.k);
}

function setZoom(canvas: ICanvas, factor: number) {
  // like scaleExtent but for zoom controls
  if (factor > maxZoom || factor < minZoom) {
    return false;
  }
  const x = canvas.fixedX || 0;
  const y = canvas.fixedY || 0;
  const scale = factor;
  if (isNaN(x) || isNaN(y) || isNaN(scale)) {
    return false;
  }
  canvas.transition(d3transition.transition('zoom').duration(100))
    /*.attr('style',
      `transform-origin:
      ${event.sourceEvent.offsetX * factor}px
      ${event.sourceEvent.offsetY * factor}px`)*/
    .attr('transform', `translate(${x}, ${y}) scale(${scale})`);
  canvas.scaleFactor = scale;
}

function getWidth(d, zoomLevel) {
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth === 0 ? rectWidth : circleWidth;
    case 2: case 3:
      // vocabularies, conceptClasses
      return [1, -1].includes(d.depth) ? circleWidth : rectWidth;
    default:
      // maximum
      return rectWidth;
  }
}

function getHeight(d, zoomLevel) {
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth === 0 ? rectHeight : circleHeight;
    case 2: case 3:
      // vocabularies, conceptClasses
      return [1, -1].includes(d.depth) ? circleHeight : rectHeight;
    default:
      // maximum
      return rectHeight;
  }     
}

function getBorderRadius(d, zoomLevel) {
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth === 0 ? conceptBorderRadius : circleBorderRadius;
    case 2: case 3:
      // vocabularies, conceptClasses
      return [1, -1].includes(d.depth) ? circleBorderRadius : conceptBorderRadius;
    default:
      // maximum
      return conceptBorderRadius;
  }
}

function getLeftPadding(svgElement, d, zoomLevel) {
  const textWidth = Math.ceil(svgElement.getBBox().width);
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth === 0 ? conceptLeftPadding : (circleWidth - textWidth) / 2;
    case 2: case 3:
      // vocabularies, conceptClasses
      return [1, -1].includes(d.depth) ? (circleWidth - textWidth) / 2 : conceptLeftPadding;
    default:
      // maximum
      return conceptLeftPadding;
  }     
}

function getTopPadding(svgElement, d, zoomLevel) {
  const textHeight = svgElement.getBBox().height;
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth === 0 ? conceptTopPadding : (circleHeight + textHeight) / 2 - 5;
    case 2: case 3:
      // vocabularies, conceptClasses
      return [1, -1].includes(d.depth) ? (circleHeight + textHeight) / 2 - 5 : conceptTopPadding;
    default:
      // maximum
      return conceptTopPadding;
  }
}

function getFontSizeClass(d, zoomLevel) {
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth !== 0 ? 'bold-text' : '';
    default:
      // maximum
      return '';
  }
}

function getHint(d, zoomLevel) {
  switch (zoomLevel) {
    case 1:
      // minimum
      return d.depth === 0 ? d.name : `${d.count} vocabularies`;
    case 2: case 3:
      // vocabularies
      if ([1, -1].includes(d.depth)) {
        return `Vocabulary '${d.name}' (${d.count} concept classes)`;
      } else if ([2, -2].includes(d.depth)) {
        return `'${d.name}' concept class (${d.count} concepts)`;
      } else {
        return d.name;
      }
    default:
      // maximum
      return d.name;
  }
}

function printGraph(
  container: SVGElement,
  terms: Array<GraphNode>,
  links: Array<GraphConnection>,
  redirect: Function,
  setLoadingStatus: Function,
  zoomLevel: number
 ) {
  // prevent not nessessary rendering
  if (!terms.length) {
    return false;
  }
  let width: number, height: number;
  width = container.getBoundingClientRect().width,
  height = container.getBoundingClientRect().height;
  let captionTransitionTimeout;

  const svg = d3select
    .select(container)
    .attr('viewBox', `0 0 ${width} ${height}`);   

  const treeWrapper: any = svg.selectAll('g#wrapper');
  let initialZoom = 0.75;
  if (zoomLevel === 3) {
    // concept classes
    initialZoom = 0.35;
  } else if (zoomLevel === 4) {
    initialZoom = 0.6;
  }
  treeWrapper.scaleFactor = initialZoom;
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
    .scaleExtent([minZoom, maxZoom]);

  svg
    .call(drag)
    .call(zoom);
  // disable double click
  svg
    .on('dblclick.zoom', () => {})
    // set initial event.transform.k value
    .call(zoom.scaleTo, initialZoom);

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
    fy: (height - getHeight(concept, zoomLevel))/2 + concept.yDepth * gapWidth,
    fx: (width - getWidth(concept, zoomLevel))/2 - concept.depth * (rectWidth + gapWidth)
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
  wrappers.attr('class', 'node')
    .attr('height', d => getHeight(d, zoomLevel))
    .attr('width', d => getWidth(d, zoomLevel))
    .classed('clickable', zoomLevel === 4)
    .on('click', (d: GraphNode) => {
      if (zoomLevel === 4) {
        redirect(d.id);
      }
    })
    .on('mouseover', (d: GraphNode) => {
      clearTimeout(captionTransitionTimeout);
      conceptName.text(getHint(d, zoomLevel));
    })
    .on('mouseout', (d: GraphNode) => {
      captionTransitionTimeout = setTimeout(() => conceptName.text(''), 300);
    })
    .attr('transform', (d: GraphNode) => {
      return `translate(${d.fx}, ${d.fy})`;
    });
  wrappers.append('svg:rect')    
    .attr('class', (d: GraphNode) => d.isCurrent ? 'nodeWrapper current' : 'nodeWrapper')
    .attr('height', d => getHeight(d, zoomLevel))
    .attr('width', d => getWidth(d, zoomLevel))
    .attr('rx', d => getBorderRadius(d, zoomLevel))
    .attr('ry', d => getBorderRadius(d, zoomLevel));

  // first line
  wrappers.append('svg:text')
    .text((d: GraphNode) => `${d.name.length > maxNameLength
      ? d.name.substr(0, maxNameLength) + '...'
      : d.name
    }`)
    .attr('class', d => getFontSizeClass(d, zoomLevel))
    .attr('x', function (d) { return getLeftPadding(this, d, zoomLevel) })
    .attr('y', function (d) { return getTopPadding(this, d, zoomLevel) });
  
  // second line
  wrappers.append('svg:text')
    .text((d: GraphNode) => {
      let text = '';
      if (zoomLevel > 1
        && zoomLevel < 4
        && d.depth !== 0
        && d.count
      ) {
        text = d.count.toString();
      } else if (d.depth === 0) {
        text = '';
      }

      if (zoomLevel === 1 && d.depth !== 0) {
        text = d.depth === -1 ? 'Descendant' : 'Ancestor';
      }

      return text;
    })
    .attr('x', function (d) {
      let padding = getLeftPadding(this, d, zoomLevel);
      if (
        zoomLevel !== 4 &&
        ![1, -1].includes(d.depth)
      ) {
        // if it's not max zoom, then for rect(!)-shaped nodes add label on the righthands
        padding = getWidth(d, zoomLevel) - (padding + this.getBBox().width);
      }
      return padding;
    })
    .attr('y', function (d) {
      let padding = getTopPadding(this, d, zoomLevel);
      if (
        zoomLevel !== 4 &&
        [1, -1].includes(d.depth)
      ) {
        // if it's not max zoom, then for circe(!)-shaped nodes add second line
        padding += this.getBBox().height + 2;
      }
      return padding;
    });

  // conditionally, third line
  if (zoomLevel === 1) {
    wrappers.append('svg:text')
      .text((d: GraphNode) => {
        if (d.depth !== 0) {
          return 'vocabs';
        }
      })
      .attr('x', function (d) { return getLeftPadding(this, d, zoomLevel) })
      .attr('y', function (d) {
        return getTopPadding(this, d, zoomLevel) + this.getBBox().height * 2;
      });
  }

  const connections = treeWrapper.selectAll('path.link')
    .data(links, (d: any) => `${d.source}-${d.target}`);
  // remove all connections
  connections
    .exit()
    .remove();
  const connectors = connections
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('marker-end', 'url(#end)')
    .transition(d3transition.transition('d').duration(100))
    .attr('d', (c: GraphLink) => {
      const source = find(termsFixed, (d: GraphNode) => d.id === c.source);
      const target = find(termsFixed, (d: GraphNode) => d.id === c.target);
      const from = {
        x: source.fx + getWidth(source, zoomLevel),
        y: source.fy + getHeight(source, zoomLevel)/2
      }
      const to = {
        x: target.fx,
        y: target.fy + getHeight(target, zoomLevel)/2
      };
      return diagonal(from, to, source.depth <= target.depth);
    });
  setLoadingStatus(false);

  // zoom controls
  const zoomControls = svg.selectAll('g#zoom-controls');
  zoomControls.attr('transform', () => `translate(${width-controlSize*1.5}, ${controlSize/2})`);
  zoomControls.selectAll('g#zoom-in-container')
    .on('mousedown', () => setZoom(treeWrapper, treeWrapper.scaleFactor + zoomStep));
  zoomControls.selectAll('g#zoom-out-container')
    .attr('transform', () => `translate(0, ${controlSize + controlsGapSize})`)
    .on('mousedown', () => setZoom(treeWrapper, treeWrapper.scaleFactor - zoomStep));
  zoomControls.selectAll('text#zoom-in')
    .attr('x', () => controlSize/2)
    .attr('y', () => controlSize/2);
  zoomControls.selectAll('text#zoom-out')
    .attr('x', () => controlSize/2)
    .attr('y', () => controlSize/2);

  // combine intersection center and wrapper center
  const wrapperBBox = treeWrapper.node().getBoundingClientRect();
  const svgBBox = svg.node().getBoundingClientRect();
  const intersection = {
    top: Math.max(svgBBox.top, wrapperBBox.top),
    left: Math.max(svgBBox.left, wrapperBBox.left),
    right: Math.max(svgBBox.right, Math.min(svgBBox.right, wrapperBBox.right)),
    bottom: Math.max(svgBBox.bottom , Math.min(svgBBox.bottom, wrapperBBox.bottom)),
  };
  const wrapperCenter = {
    x: wrapperBBox.left + wrapperBBox.width / 2,
    y: wrapperBBox.top + wrapperBBox.height / 2,
  };
  const intersectionCenter = {
    x: intersection.left + (intersection.right - intersection.left) / 2,
    y: intersection.top + (intersection.bottom - intersection.top) / 2,
  };
  treeWrapper.fixedX = intersectionCenter.x - wrapperCenter.x;
  treeWrapper.fixedY = intersectionCenter.y - wrapperCenter.y;

  setZoom(treeWrapper, initialZoom);
}

function TermConnections(props: ITermConnectionsProps) {
  const {
    terms,
    links,
    goToTerm,
    isInProgress,
    setLoadingStatus,
    termFilters,
  } = props;
  const classes = BEMHelper('term-connections');

  return <div
      {...classes()}>
    <svg
      {...classes('graph')}
      preserveAspectRatio='xMinYMax slice'
      ref={element => {
        if (element && terms) {
          printGraph(element, terms, links, goToTerm, setLoadingStatus, termFilters.zoomLevel);
        }
      }}
    >
      <g id='wrapper'></g>
      <g id='concept-name'>
        <rect id='concept-name-bg'></rect>
        <text id='concept-name-text'></text>
      </g>
      <g id='zoom-controls'>
        <g id='zoom-in-container'>
          <rect id='zoom-in-bg'></rect>
          <text id='zoom-in'>+</text>
        </g>
        <g id='zoom-out-container'>
          <rect id='zoom-out-bg'></rect>
          <text id='zoom-out'>-</text>
        </g>
      </g>
    </svg>
    <LoadingPanel active={isInProgress} />
  </div>;
}

export default TermConnections;
export {
  ITermConnectionsStateProps,
  ITermConnectionsDispatchProps,
  ITermConnectionsProps,
  GraphNode,
  GraphConnection,
};
