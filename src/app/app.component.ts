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
 * Main App Component - used for interaction testing of rectangle selector/n-gon component
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

// platform imports
import {
  Component,
  Inject
} from '@angular/core';

// initial number of sides in the n-gon
import { INIT_SIDES } from './tokens';

// model for selected rectangular area
import { IRect } from './components/regular-ngon.component';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss']
})
export class AppComponent
{
  public rectangle: IRect;       // selected rectangular area
  public sides: number;          // number of sides of the regular n-gon

  /**
   * Construct a new AppComponent instance
   *
   * @param {number} _sides Injected initial number of sides (provided in main module file)
   *
   * @returns {nothing}
   */
  constructor(@Inject(INIT_SIDES) protected _sides: number)
  {
    this.rectangle = {left: 0, top: 0, right: 0, bottom: 0};
    this.sides     = _sides;
  }

  /**
   * Execute when user changes the number of sides in the n-gon
   *
   * @param {number} sides New number of sides
   *
   * @returns {nothing}
   */
  public onSidesSelected(sides: number): void
  {
    this.sides = sides;
  }

  /**
   * Execute whenever the selected rectangular area changes
   *
   * @param {IRect} rect Bounds for new selected area
   *
   * @returns {nothing}
   */
  public onRectSelected(rect: IRect): void
  {
    this.rectangle = rect;
  }
}
