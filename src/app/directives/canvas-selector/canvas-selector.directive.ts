/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Directive to select a Canvas element and create an EaselJS stage is from that reference.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import * as createjs from 'createjs-module';

 // platform imports
 import { Directive
        , OnInit
        , AfterViewInit
        , ElementRef
        } from '@angular/core';

 @Directive({
  selector: 'canvas'
 })

 export class CanvasSelectorDirective implements OnInit, AfterViewInit
 {
   protected _canvas: HTMLCanvasElement;  // direct reference to the canvas

   constructor(private _elRef: ElementRef)
   {
     this._canvas = <HTMLCanvasElement> this._elRef.nativeElement;
   }

   public ngOnInit(): void
   {
     // reserved for future use
   }

   /**
    * Angular lifecycle event - after view init
    */
   public ngAfterViewInit(): void
   {
     // reserved for future use
   }

  /**
   * Create an EaseJS stage from the HTML Canvas reference
   *
   * @return createjs.Stage Stage reference or null if no canvas is defined
   */
   public createStage(): createjs.Stage
   {
     return this._canvas ? new createjs.Stage(this._canvas) : null;
   }

  /**
   * Access the canvas width
   *
   * @return number Canvas width or zero if the internal Canvas reference is not yet defined
   */
   public get width(): number
   {
     return this._canvas ? this._canvas.width : 0;
   }

  /**
   * Access the canvas height
   *
   * @return number Canvas height or zero if the internal Canvas reference is not yet defined
   */
   public get height(): number
   {
     return this._canvas ? this._canvas.height : 0;
   }

   /**
    * Assign a new Canvas width
    *
    * @param {number} value Desired Canvas width
    *
    * @returns {nothing}
    */
   public set width(value: number)
   {
     if (!isNaN(value) && value >= 0 && this._canvas) {
       this._canvas.width = value;
     }
   }

   /**
    * Assign a new Canvas height
    *
    * @param {number} value Desired Canvas height
    *
    * @returns {nothing}
    */
   public set height(value: number)
   {
     if (!isNaN(value) && value >= 0 && this._canvas) {
       this._canvas.height = value;
     }
   }
 }
