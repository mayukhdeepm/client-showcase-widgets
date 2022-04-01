import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import '@kitware/vtk.js/Rendering/Profiles/Glyph';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkAngleWidget from '@kitware/vtk.js/Widgets/Widgets3D/AngleWidget';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';

const controlPanel = `
<div>
  <button>GrabFocus</button>
  <div>Angle (radians): <span id="angle">0</span></div>
</div>
`

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();

const cone = vtkCubeSource.newInstance();
const mapper = vtkMapper.newInstance();
const actor = vtkActor.newInstance();

actor.setMapper(mapper);
mapper.setInputConnection(cone.getOutputPort());
actor.getProperty().setOpacity(0.5);

renderer.addActor(actor);

// ----------------------------------------------------------------------------
// Widget manager
// ----------------------------------------------------------------------------

const widgetManager = vtkWidgetManager.newInstance();
widgetManager.setRenderer(renderer);

const widget = vtkAngleWidget.newInstance();
widget.placeWidget(cone.getOutputData().getBounds());

widgetManager.addWidget(widget);

renderer.resetCamera();
widgetManager.enablePicking();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

widget.getWidgetState().onModified(() => {
  document.querySelector('#angle').innerText = widget.getAngle();
});

document.querySelector('button').addEventListener('click', () => {
  widgetManager.grabFocus(widget);
});

// -----------------------------------------------------------
// globals
// -----------------------------------------------------------

global.widget = widget;