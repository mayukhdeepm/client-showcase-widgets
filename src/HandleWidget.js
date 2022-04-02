// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkHandleWidget from '@kitware/vtk.js/Interaction/Widgets/HandleWidget';

// ----------------------------------------------------------------------------
// USER AVAILABLE INTERACTIONS
// ----------------------------------------------------------------------------
// Sphere can be translated by clicking with mouse left on it
// Sphere can be scaled by clicking with mouse right

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();
renderWindow.getInteractor().setInteractorStyle(null);

// ----------------------------------------------------------------------------
// Create widget
// ----------------------------------------------------------------------------
const widget = vtkHandleWidget.newInstance();
widget.setInteractor(renderWindow.getInteractor());
widget.setEnabled(1);

renderWindow.render();

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.renderer = renderer;
global.renderWindow = renderWindow;
global.widget = widget;
