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

/**
 * Create a regular n-gon by interactively selecting a rectangular (Canvas) area and draw the n-gon inside that boundary
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 *
 * Dependency: createjs-module: 0.8.3
 */
import { Component,
         OnInit,
         AfterViewInit,
         OnChanges,
         OnDestroy,
         SimpleChange,
         SimpleChanges,
         Input,
         Output,
         Inject,
         EventEmitter,
         ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs';

import { INIT_SIDES } from '../tokens';

import { CanvasSelectorDirective } from '../directives/canvas-selector/canvas-selector.directive';

import { ADT$RectangleSelector } from '../libs/ADTRectangleSelector';

import { RegularNgon } from '../libs/RegularNgon';

import * as createjs from 'createjs-module';

// model for a rectangular boundary
export interface IRect
{
  top: number;
  left: number;
  right: number;
  bottom: number;
}

@Component({
  selector: 'ng-ngon-component',

  template: `
    <canvas></canvas>
    <div [style.width.px]="width" class="controls">
      <label for="sides" class="rm10">Sides</label> 
      <input id="sides" #sides class="rm25" type="number" min="3" max="16" value="{{initSides}}" (change)="onSidesSelected(sides.value)">
      <button class="basic-button" (click)="onClear()">Clear</button>
    </div>
  `,

  styleUrls: ['./regular-ngon.component.scss']
})
export class RegularNgonComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * @type {string} Input width in pixels
   */
  @Input('width')
  public width: string;

  /**
   * @type {string} Input height in pixels
   */
  @Input('height')
  public height: string;

  /**
   * {IRect} Output selected rectangular boundary
   */
  @Output('selected')
  protected _rectSelected: EventEmitter<IRect>;

  /**
   * {number} Output number of n-gon sides
   */
  @Output('sides')
  protected _sides: EventEmitter<number>;

  // reference to Canvas selector
  @ViewChild(CanvasSelectorDirective)
  protected _canvasSelector: CanvasSelectorDirective;

  // EaselJS stage and n-gon shape
  protected _stage: createjs.Stage;
  protected _ngonShape: createjs.Shape;

  protected _selector: ADT$RectangleSelector;    // Angular Dev Toolkit Rectangle selector for EaselJS

  protected _ngon: RegularNgon;                  // Reference to abbreviated Typescript Math Toolkit Regular N-Gon

  protected _subscription: Subscription;         // subscribe to updates from ADT rectangle selector

  // bounding rectangle
  protected _left: number   = 0;
  protected _top: number    = 0;
  protected _right: number  = 0;
  protected _bottom: number = 0;

  /**
   * Construct a new RegularNgonComponent
   *
   * @param {number} _initSides Initial number of sides
   *
   * @returns {nothing}
   */
  constructor(@Inject(INIT_SIDES) protected _initSides: number)
  {
    this._rectSelected = new EventEmitter<IRect>();
    this._sides        = new EventEmitter<number>();

    this._ngon = new RegularNgon(this._initSides);
  }

  /**
   * Angular lifecycle - on init
   *
   * @returns {nothing} Performs EaselJS setup
   */
  public ngOnInit(): void
  {
    // Setup the EaselJS stage
    this.__setup();
  }

  /**
   * Angular lifecycle - after view init
   *
   * @returns {nothing}
   */
  public ngAfterViewInit(): void
  {
    // reserved for future use
  }

  /**
   * Angular lifecycle - on changes
   *
   * @param {SimpleChanges} changes
   *
   * @returns {nothing} Processes {width} and {height} inputs
   */
  public ngOnChanges(changes: SimpleChanges): void
  {
    let prop: string;
    let change: SimpleChange;

    for (prop in changes)
    {
      if (prop == 'width')
      {
        change = changes[prop];

        if (change.currentValue !== undefined)
        {
          // set defaults, if necessary
          this.width = change.currentValue > 0 ? change.currentValue : 100;
        }
      }
      else if (prop == 'height')
      {
        change = changes[prop];

        if (change.currentValue !== undefined)
        {
          // set defaults, if necessary
          this.height = change.currentValue > 0 ? change.currentValue : 100;
        }
      }
    }
  }

  /**
   * Angular lifecycle - on destroy
   *
   * @returns {nothing}
   */
  public ngOnDestroy(): void
  {
    if (this._selector) {
      this._selector.destroy();
    }

    if (this._subscription) {
      this._selector.rectSelected.unsubscribe();
    }
  }

  /**
   * Access the initial number of sides of the n-gon
   *
   * @returns {string} Number of sides as string
   */
  public get initSides(): string
  {
    return this._initSides !== undefined ? this._initSides.toString() : '0';
  }

  /**
   * Redraw the n-gon when the number of sides is changed
   *
   * @param {string} sides New number of sides (generally passed directly from an HTML {input})
   */
  public onSidesSelected(sides: string): void
  {
    this._ngon.sides = +sides;
    this._ngon.generate(this._left, this._top, this._right, this._bottom);

    this._sides.emit(+sides);

    this.__draw();
  }

  /**
   * Clear this component and prepare for another n-gon to be defined
   *
   * @returns {nothing}
   */
  public onClear(): void
  {
    this._ngonShape.graphics.clear();

    // reset the selector for another rectangle selection (i.e. process stage mouse-down)
    this._selector.reset();

    this._stage.update();
  }

  /**
   * Peform EaselJS setup
   *
   * @returns {nothing}
   * @private
   */
  protected __setup(): void
  {
    this._stage                 = this._canvasSelector.createStage();
    this._canvasSelector.width  = +this.width;
    this._canvasSelector.height = +this.height;

    // add a Shape to render the N-gon and another for the rectangle selector
    this._ngonShape = new createjs.Shape();

    this._selector     = new ADT$RectangleSelector(this._stage, +this.width, +this.height);
    this._subscription = this._selector.rectSelected.subscribe( (rect: IRect) => this.__onRectSelected(rect) );

    this._stage.addChild(this._ngonShape);
  }

  /**
   * Process rectangular boundary changes
   *
   * @param {IRect} rect New boundary
   *
   * @returns {nothing}
   * @private
   */
  protected __onRectSelected(rect: IRect): void
  {
    // for now, use integer coordinates
    this._left   = Math.round(rect.left);
    this._top    = Math.round(rect.top);
    this._right  = Math.round(rect.right);
    this._bottom = Math.round(rect.bottom);

    this._ngon.generate(this._left, this._top, this._right, this._bottom);

    this.__draw();

    this._rectSelected.emit({left: this._left, top: this._top, right: this._right, bottom: this._bottom});
  }

  /**
   * Redraw the n-gon based on current bounding box and number of sides
   *
   * @returns {nothing}
   * @private
   */
  protected __draw(): void
  {
    const xcoord: Array<number> = this._ngon.xcoord;
    const ycoord: Array<number> = this._ngon.ycoord;

    const n: number = xcoord.length;
    let i: number;

    const g: createjs.Graphics = this._ngonShape.graphics;
    g.clear();
    g.setStrokeStyle(2);
    g.beginStroke('#0000ff');

    g.moveTo(xcoord[0], ycoord[0]);

    for (i = 1; i < n; ++i) {
      g.lineTo(xcoord[i], ycoord[i]);
    }

    g.lineTo(xcoord[0], ycoord[0]);
    g.endStroke();

    this._stage.update();
  }
}
