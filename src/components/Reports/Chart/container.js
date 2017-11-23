/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexander Saltykov
 * Created: November 21, 2017
 *
 */

import { Component } from 'react';
import { ContainerBuilder } from 'services/Utils';
import * as d3 from 'd3';
import presenter from './presenter';

class Chart extends Component {
  constructor() {
    super();
    this.container = null;
    this.setContainer = this.setContainer.bind(this);
    this.downloadAsPng = this.downloadAsPng.bind(this);
    this.width = 0;
    this.height = 0;
    this.styles = `
    <![CDATA[
      svg {
        background: #fff;
      }
      .donut text {
        font-size: 1.2rem;
      }            
      .lineplot .line {
        fill: transparent;
        stroke: #50A5BA;
      }      
      .lineplot  circle.focus {
        opacity: 0;
      }      
      .bar {
        fill: #50A5BA;
      }      
      .boxplot .bar, .boxplot .whisker, .boxplot .box, .boxplot .median {
        stroke: #50A5BA;
      }      
      .boxplot .box {
        fill: #50A5BA;
      }
      .g-trellis .y-guide .tick line,
      .g-trellis .x-guide .tick line {
        stroke: #ccc;
        stroke-width: .6;
      }
      .g-trellis .y-guide .domain,
      .g-trellis .x-guide .domain {
        stroke: none;
      }
      .g-trellis .g-overlay {
        fill: none;
        pointer-events: all;
      }
      .grouper {
        fill: none;
        stroke: white;
        stroke-width: 2px;
      }
      .treemap_zoomtarget {
        padding: 0.5rem 20px;
      }
    ]]>`;
  }

  setContainer(element) {
    if (element && this.props.isDataPresent) {
      this.container = element;
      const dimensions = this.container.getBoundingClientRect();
      this.width = dimensions.width;
      this.height = dimensions.height;
      this.props.render({
        width: this.width,
        height: this.height,
        element,
      });
    }
  }

  downloadAsPng() {
    if (this.container) {
        //.toBlob(this.container).then((blob) => window.saveAs(blob, `${this.props.title.replace(/\W/g, '')}.png`));
      const docType = `<?xml version="1.0" standalone="no"?>      
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`;
      const svg = d3.select(this.container).select('svg');
      svg.append('style').html(this.styles);
      const source = (new XMLSerializer()).serializeToString(svg.node());
      const blob = new Blob([`${docType}${source}`], { type: 'image/svg+xml;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const img = d3.select(this.container).append('img').node();
      img.onload = () => {
        // Now that the image has loaded, put the image into a canvas element.
        const canvas = d3.select(this.container).append('canvas').node();
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const canvasUrl = canvas.toDataURL('image/png');
        const a = d3.select(this.container).append('a').node();
        a.download = `${this.props.title.replace(/\W*/g, '')}.png`;
        a.href = canvasUrl;
        a.target = '_blank';
        a.click();
        a.remove();
        canvas.style.display = 'none';
        img.style.display = 'none';
        canvas.remove();
        img.remove();
      };
      img.src = url;

    }
  }

  render() {
    return presenter({
      ...this.props,
      setContainer: this.setContainer,
      downloadAsPng: this.downloadAsPng,
    });
  }
}

export default class ChartBuilder extends ContainerBuilder {
  getComponent() {
    return Chart;
  }
}
