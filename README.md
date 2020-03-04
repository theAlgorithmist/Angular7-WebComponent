# Angular 7 Web Components (Angular Elements)

Angular Elements was available prior to the version 7 release, but the current state of the Ivy renderer really makes a compelling case for the production use of Angular-created Web Components.  This repository illustrates project setup and implementation of a custom component that is suitable for both standalone use inside Angular as well as direct export as a Web Component.

The component of interest is a combination of a (Canvas) rectangle selector and a regular n-gon.  The number of sides of the n-gon is user-selectable and the n-gon is dynamically drawn inside a rectangular bounding area.  That area is defined by means of pressing and then dragging the mouse inside the Canvas.  The Component is usable (dev or prod) inside Angular and can be exported as a Web Component by simply setting an environment variable and then running an _npm_ command.

The exported Web Component is currently running on my domain (algorithmist.net) - a link is provided at the end of the repo.  Experiment with different browsers and polyfill configurations to determine the scope under which this technique is usable for various applications.

Author:  Jim Armstrong - [The Algorithmist](https://www.linkedin.com/in/jimarmstrong)

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 7.1.3

Typescript: 3.1.6

Angular CLI: 7.0.6

createjs-module: 0.8.3

@webcomponents/custom-elements: 1.2.1

concat: 1.0.3

fs-extra: 7.0.1

Version: 1.0

## Introduction

A common theme in most custom components I've developed over the years, regardless of platform (DHTML, Flash, Angular) is dynamic drawing.  This demo illustrates a concept I have used frequently, ever since the release of Flash 6.  It involves dynamically drawing an object inside a rectangular bounding box.  The size and location of the bounding box allows the same _template_ to draw the object at any position and scale, without the need for transformations.  The bounding box itself is interactively created by press-and-drag inside a (Canvas) drawing area.

This makes a moderately interesting demo in and of itself, but it's far more interesting to consider the rectangle selection and object drawing as a standalone Web Component.  So, I took the Rectangle Selector out of my client-proprietary Angular Dev Toolkit and added a minimal-feature version of the Typescript Math Toolkit Regular N-gon.  These two items form the core of a Canvas-based interactive N-gon drawing tool (written on top of EaselJS).

There are other tutorials and videos on Angular Elements. A common theme, however, is that that main _AppComponent_ is exported as a Web Component and the project setup is modified specifically for that purpose.

Please note that this is not a complete tutorial on Angular Elements; there are several blog posts and videos that cover that topic.  It will be helpful to have at least reviewed available material on this topic before working with the code supplied in this repo.


## Basic Setup

Project setup consists of three parts; an environment variable, an _app.module.ts_ file configured to use that variable, and a build script.  But, before that, we need some polyfills (see _polyfills.ts_) - zone.js fix is also performed here.

```
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
import '@webcomponents/custom-elements/src/native-shim';
import '@webcomponents/custom-elements/custom-elements.min';
```

*****
**Environment**

This is the _/environments/environments.prod.ts_ file.

```
export const environment = {
  production: true,
  webComponent: false
};
```

The _webComponent_ variable is a boolean that is set to false for normal, i.e. inside-Angular testing, either _dev_ or _prod_.  This variable is set to _true_ if the Web Component is to be exported for production use.

*****
**app.module.ts**

The _webComponent_ variable is used inside the _app.module.ts_ file as shown below,

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';

// the usual suspects; AppComponent is used for interactive testing - the RegularNgonComponent is exported as 
// a WebComponent during a prod build
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
```

*****
**Build Script**

I thought about doing this another way, but consultation with devs whose opinion I appreciate led me to believe this was a better approach.  It is in line with other tutorials on the subject and will be familiar with anyone having a moderate amount of _npm_ experience.

After setting the _webComponent_ variable to _true_ for component export, execute the command

_npm run build:webcomponent_

This builds a bundle, _ng_ngon_component.js_ in the _elements_ folder under the main project folder.

That's it!  The rectangle selector and regular n-gon component is ready to use in any environment that supports Web Components.  The current build uses a minimal number of polyfills, so expect a bit more limited browser support.

## The Component

The main _AppComponent_ is used as an interactive testbed for the primary web component, which is _app/components/regular-ngon.component_.  This can be seen from the _/app/app.component.html_ file,

```
<!-- not part of the webcomponent -->
<p class="mainContent">Press and drag to create a regular n-gon</p>
<!-- this will be the custom webcomponent -->
<ng-ngon-component width="400" height="400" (selected)="onRectSelected($event)" (sides)="onSidesSelected($event)"></ng-ngon-component>
<!-- remainder is part of the Angular test environment (AppComponent) -->
<p class="mainContent">N-gon sides: {{sides}}</p>
<p class="mainContent">Bounding Rectangle: left: {{rectangle.left}} top: {{rectangle.top}} right: {{rectangle.right}} bottom: {{rectangle.bottom}}</p>
```

The _RegularNgonComponent_ class exposes two outputs, the number of sides of the n-gon and the boundaries of the currently selected rectangular boundary.  Both are reflected into the test UI.  The _RegularNgonComponent_ may be tested inside Angular in either _dev_ or _prod_ mode as with any other Angular CLI project (set the _webComponent_ variable mentioned above to false).

## Direct Use In A Browser

Using the _RectangularNgonComponent_ inside any supporting browser is relatively easy.  The Angular Component _Outputs_ come across as _CustomEvent_ instances and can be hooked into via vanilla Javascript.  Here is a pretty trivial example,

```
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Regular N-Gon WebComponent</title>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="stylesheet" href="styles.css">
  <!-- zone.js fix -->
  <script type="text/javascript" src="https://unpkg.com/zone.js@0.8.26/dist/zone.min.js"></script>
  <script type="application/javascript" src="ng-ngon-component.js"></script>
</head>

<body>
  <div class="mainContent">
    <p>(Canvas) Rectangle selector and regular n-gon.</p>
    <p>Author: Jim Armstrong, <a class="main" href='http://algorithmist.net' target='_blank'>The Algorithmist</a></p>
  </div>

  <!-- your friendly, neighborhood webcomponent -->
  <ng-ngon-component id="ngon-component" width="400" height="400"></ng-ngon-component>

  <div class="mt20">
  <p class="mainContent" id="pSides">Sides: 4</p>
  <p class="mainContent" id="pRect"></p>
  </div>

  <div class="mainContent mt20">
    &copy; 2018 The Algorithmist.
  </div>
</body>

<script type="text/javascript">
  /* I can't believe I'm doing this ... someone shoot me! */
  var ngon   = document.getElementById('ngon-component');
  var pSides = document.getElementById('pSides');
  var pRect  = document.getElementById('pRect');

  ngon.addEventListener('sides', function(evt) {pSides.innerText='Sides: ' + evt.detail});
  ngon.addEventListener('selected', function(evt) {pRect.innerText='Selected left: ' + evt.detail.left + ' top: ' + evt.detail.top + ' right: ' + evt.detail.right + ' bottom: ' + evt.detail.bottom});
</script>

</html>
```

This example is actually [running on my domain](http://algorithmist.net/elements/index.html).  The zone.js fix is technically not required for this to work, but this represents an easy workaround if you want to re-use the Angular Web Component inside Angular.

Now, I made no attempt to optimize file size, either in imports from the _createjs_ library or by gzipping the bundle.  Just implementing the latter option takes bundle size down to just below 100K (with zone.js loaded in the _index.html_ file), which is rather respectable for everything the component is doing.

Please feel free to experiment with additional browser polyfills and optimization ... but more importantly, have fun and drink more coffee!


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
