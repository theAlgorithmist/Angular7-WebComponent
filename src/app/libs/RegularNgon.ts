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
 * A simple Regular N-gon generator; this is a subset of the Typescript Math Toolkit regular n-gon.  Set the desired
 * number of sides and then call the {generate} method to compute the list of x- and y-coordinates relative to a
 * supplied bounding box.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

export class RegularNgon
{
  protected static readonly SQRT_2: number  = 1.41421356237;
  
  // 2D coordinates
  protected _xcoord: Array<number>;
  protected _ycoord: Array<number>;

  // number of sides
  protected _sides: number = 3;

  /**
   * Construct a new Regular N-gon
   *
   * @param {number} sides Number of sides
   *
   * @returns {nothing}
   */
  constructor(sides: number = 3)
  {
    this.sides = sides;

    this._xcoord = new Array<number>();
    this._ycoord = new Array<number>();
  }

  /**
   * Access the list of x-coordinates after the n-gon is generated
   *
   * @returns {Array<number>}
   */
  public get xcoord(): Array<number>
  {
    return this._xcoord.slice();
  }

  /**
   * Access the list of y-coordinates after the n-gon is generated
   *
   * @returns {Array<number>}
   */
  public get ycoord(): Array<number>
  {
    return this._ycoord.slice();
  }

  /**
   * Access the number of sides of the n-gon
   *
   * @returns {number}
   */
  public get sides(): number
  {
    return this._sides;
  }

  /**
   * Assign the number of sides to the n-gon
   *
   * @param {number} value Desired number of sides (should be integer and greater than two)
   */
  public set sides(value: number)
  {
    this._sides = isNaN(value) || value < 3 ? this._sides : value;
  }

  /**
   * Generate n-gon vertices given a bounding box
   *
   * @param {number} left x-coordinate of upper, left-hand corner of bounding box
   * @param {number} top y-coordinate of upper, left-hand corner of bounding box
   * @param {number} right x-coordinate of lower, right-hand corner of bounding box
   * @param {number} bottom y-coordinate of lower, right-hand corner of bounding box
   *
   * @returns {nothing}
   */
  public generate(left: number, top: number, right: number, bottom: number): void
  {
    this._xcoord.length = 0;
    this._ycoord.length = 0;

    // radius of bounding circle
    const d1 = right - left;
    const d2 = bottom - top;
    const d  = d1 < d2 ? d1 : d2;  // dimension of inscribed square
    const r  = 0.5*d;              // radius of bounding circle

    // midpoints along horizontal (x) and vertical (y) directions that correspond to the center of the n-gon
    const cx = 0.5*(left + right);
    const cy = 0.5*(top + bottom);

    // angle based on number of sides
    const angle = 2*Math.PI/this._sides;
    let t       = 1.5*Math.PI;  // always start at 3pi/2, i.e. first vertex straight-up.

    // presumption of y-down coordinate system
    this._xcoord.push(cx);
    this._ycoord.push(cy - r);

    let i: number = 1  ;
    while( i < this._sides )
    {
      t += angle;

      this._xcoord.push( r*Math.cos(t) + cx );
      this._ycoord.push( r*Math.sin(t) + cy );

      i++;
    }
  }
}
