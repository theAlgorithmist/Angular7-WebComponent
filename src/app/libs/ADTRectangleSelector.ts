/**
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as createjs from 'createjs-module';

import { Subject } from 'rxjs';

import { IRect } from '../components/regular-ngon.component';

/**
 * Angular Dev Toolkit: Select a rectangle on the stage by means of press and drag.  Usage is one-time only; a shape is added to
 * the stage in which the bounding rectangle is drawn.  All stage event handlers are removed after mouse release.  Call the
 * {reset} method to prepare for selecting a new bounding rectangle.  This component is reactive; subscribe to {IRect} updates
 * via the {rectSelected Subject}.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
export class ADT$RectangleSelector
{
  public rectSelected: Subject<IRect>;          // allow external subscription

  // the full ADT selector has configurable line and color settings; modify if you desire
  protected static readonly DEF_COLOR: string          = '#FF8C00';
  protected static readonly DEF_LINE_THICKNESS: number = 2;

  protected _stage: createjs.Stage;
  protected _selectorShape: createjs.Shape;

  // selector top/left/right/bottom
  protected _selectorTop: number    = 0;
  protected _selectorLeft: number   = 0;
  protected _selectorRight: number  = 0;
  protected _selectorBottom: number = 0;

  // canvas width/height
  protected _canvasLength: number = 0;
  protected _canvasHeight: number = 0;

  // x/y on press
  protected _origX: number = 0;
  protected _origY: number = 0;

  /**
   * Construct a new ADT$RectangleSelector
   *
   * @param {createjs.Stage} stage Reference to EaselJS Stage
   *
   * @param {number} width Pixel width of the stage
   *
   * @param {number} height Pixel height of the stage
   *
   * @returns {nothing}
   */
  constructor(stage: createjs.Stage, width: number, height: number)
  {
    this._stage        = stage;
    this._canvasLength = width;
    this._canvasHeight = height;

    // initial stage setup
    this._stage.addEventListener( "stagemousedown", (evt: any): void => this.__onMouseDown(evt) );
    this._stage.mouseMoveOutside = true;

    this.rectSelected = new Subject<IRect>();
  }

  /**
   * Reset - prepare selector for new interactive selection
   *
   * @returns {nothing}
   */
  public reset(): void
  {
    this._stage.addEventListener( "stagemousedown", (evt: any): void => this.__onMouseDown(evt) );
  }

  /**
   * Destroy this selector - perpare for garbage collection
   *
   * @returns {nothing}
   */
  public destroy(): void
  {
    this._stage.removeAllEventListeners('stagemousedown');
    this._stage.removeAllEventListeners('stagemouseup'  );
    this._stage.removeAllEventListeners('stagemousemove');
  }

  /**
   * Execute on stage mousedown
   *
   * @param evt
   * @private
   */
  protected __onMouseDown(evt: any): void
  {
    this._selectorShape = new createjs.Shape();

    this._stage.addChild(this._selectorShape);

    this._selectorLeft   = this._stage.mouseX;
    this._selectorRight  = this._selectorLeft;
    this._origX          = this._selectorLeft;
    this._selectorTop    = this._stage.mouseY;
    this._selectorBottom = this._selectorTop;
    this._origY          = this._selectorBottom;

    this._stage.addEventListener( "stagemousemove", (evt: any): void => this.__onSelectorMouseMove(evt) );
    this._stage.addEventListener( "stagemouseup"  , (evt: any): void => this.__onSelectorMouseUp(evt)   );
  }

  /**
   * Execute on stage mouse move
   *
   * @param evt
   * @private
   */
  protected __onSelectorMouseMove(evt: any): void
  {
    const newX: number = this._stage.mouseX;
    const newY: number = this._stage.mouseY;

    // draw selector and set bounds
    this._selectorLeft   = Math.min(this._origX, newX);
    this._selectorRight  = Math.max(this._origX, newX);
    this._selectorTop    = Math.min(this._origY, newY);
    this._selectorBottom = Math.max(this._origY, newY);

    if (this._selectorShape)
    {
      const g: createjs.Graphics = this._selectorShape.graphics;
      g.clear();
      g.setStrokeStyle(ADT$RectangleSelector.DEF_LINE_THICKNESS);
      g.beginStroke(ADT$RectangleSelector.DEF_COLOR);
      g.moveTo(this._selectorLeft, this._selectorTop);
      g.lineTo(this._selectorRight, this._selectorTop);
      g.lineTo(this._selectorRight, this._selectorBottom);
      g.lineTo(this._selectorLeft, this._selectorBottom);
      g.lineTo(this._selectorLeft, this._selectorTop);
      g.endStroke();

      this._stage.update();

      this.rectSelected.next({
        left: this._selectorLeft,
        top: this._selectorTop, right:
        this._selectorRight, bottom:
        this._selectorBottom
      });
    }
  }

  /**
   * Execute on stage mouse up
   *
   * @param evt
   * @private
   */
  protected __onSelectorMouseUp(evt: any): void
  {
    this._stage.removeAllEventListeners( "stagemousedown" );
    this._stage.removeAllEventListeners( "stagemouseup"   );
    this._stage.removeAllEventListeners( "stagemousemove" );

    this._selectorShape.graphics.clear();
    this._stage.update();

    this._stage.removeChild(this._selectorShape);
  }
}
