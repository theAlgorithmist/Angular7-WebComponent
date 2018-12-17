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
 * Main module file for the Rectangle Selector/N-gon web component (Angular Elements) demo.  This is setup to
 * use for either interaction testing or production web component export by setting the {webComponent} property
 * to false (dev) or true (prod) in {environments/environment.prod.ts}.  For the latter case, execute the following
 * from the command line: {npm run build:webcomponent}.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

// platform imports
import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Injector, ApplicationRef} from '@angular/core';
import { createCustomElement } from '@angular/elements';

// the usual suspects; AppComponent is used for interactive testing - the RegularNgonComponent is exported as a WebComponent during a prod build
import { AppComponent            } from './app.component';
import { RegularNgonComponent    } from './components/regular-ngon.component';
import { CanvasSelectorDirective } from './directives/canvas-selector/canvas-selector.directive';

// initial number of sides for the regular n-gon
import { INIT_SIDES } from './tokens';

// set the 'webComponent' property for dev (testing) or prod (exported web component) build
import { environment } from '../environments/environment.prod';

const APP_DECLARATIONS: Array<any> = [
  AppComponent, CanvasSelectorDirective, RegularNgonComponent
];

@NgModule({
  declarations: APP_DECLARATIONS,
  imports: [
    BrowserModule
  ],
  providers: [{ provide: INIT_SIDES, useValue: 4 }],
  bootstrap: environment.webComponent ? [] : [AppComponent],
  entryComponents: environment.webComponent ? [RegularNgonComponent] : []
})
export class AppModule
{
  constructor(private _injector: Injector)
  {
    // empty
  }

  // executed during manual bootstrap
  public ngDoBootstrap(app: ApplicationRef): void
  {
    // returns NgElementConstructor<T>, but I'm being lazy :)
    const element: any = createCustomElement(RegularNgonComponent, { injector: this._injector });
    customElements.define('ng-ngon-component', element);
  }
}
