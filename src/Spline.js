import '@kitware/vtk.js/Rendering/Profiles/All';
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import vtkSplineWidget from '@kitware/vtk.js/Widgets/Widgets3D/SplineWidget';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';

import { splineKind } from '@kitware/vtk.js/Common/DataModel/Spline3D/Constants';

const controlPanel = `
<table>
  <tr>
    <td>Kind</td>
    <td></td>
    <td>
      <select class="kind">
        <option value="kochanek">Kochanek</option>
        <option value="cardinal">Cardinal</option>
      </select>
    </td>
  </tr>
  <tr>
  <tr>
    <td>Tension</td>
    <td></td>
    <td>
      <input class="tension" type="range" min="-1" max="1" step="0.1" value="0">
    </td>
  </tr>
  <tr>
    <td>Bias</td>
    <td></td>
    <td>
      <input class="bias" type="range" min="-1" max="1" step="0.1" value="0">
    </td>
  </tr>
  <tr>
    <td>Continuity</td>
    <td></td>
    <td>
      <input class="continuity" type="range" min="-1" max="1" step="0.1" value="0">
    </td>
  </tr>
  <tr>
    <td>Resolution</td>
    <td></td>
    <td>
      <input class="resolution" type="range" min="1" max="32" step="1" value="20">
    </td>
  </tr>
  <tr>
    <td>Handles size</td>
    <td></td>
    <td>
      <input class="handleSize" type="range" min="10" max="50" step="1" value="20">
    </td>
  </tr>
  <tr>
    <td>Drag (freehand)</td>
    <td>
      <input class="allowFreehand" type="checkbox" checked>
    </td>
    <td>
      <input class="freehandDistance" type="range" min="0.05" max="1.0" step="0.05" value="0.2">
    </td>
  </tr>
  <tr>
    <td>
      <button class="placeWidget" >Place Widget</button>
    </td>
  </tr>
</table>

<style>
table {
  margin-top: 100px;
}
</style>
`

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: url("../dist/dicom.png"),
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();
const iStyle = vtkInteractorStyleImage.newInstance();
renderWindow.getInteractor().setInteractorStyle(iStyle);

// ----------------------------------------------------------------------------
// Widget manager
// ----------------------------------------------------------------------------

const widgetManager = vtkWidgetManager.newInstance();
widgetManager.setRenderer(renderer);

const widget = vtkSplineWidget.newInstance();
const widgetRepresentation = widgetManager.addWidget(widget);

renderer.resetCamera();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

const tensionInput = document.querySelector('.tension');
const onTensionChanged = () => {
  widget.getWidgetState().setSplineTension(parseFloat(tensionInput.value));
  renderWindow.render();
};
tensionInput.addEventListener('input', onTensionChanged);
onTensionChanged();

const biasInput = document.querySelector('.bias');
const onBiasChanged = () => {
  widget.getWidgetState().setSplineBias(parseFloat(biasInput.value));
  renderWindow.render();
};
biasInput.addEventListener('input', onBiasChanged);
onBiasChanged();

const continuityInput = document.querySelector('.continuity');
const onContinuityChanged = () => {
  widget
    .getWidgetState()
    .setSplineContinuity(parseFloat(continuityInput.value));
  renderWindow.render();
};
continuityInput.addEventListener('input', onContinuityChanged);
onContinuityChanged();

const splineKindSelector = document.querySelector('.kind');
const onSplineKindSelected = () => {
  const isKochanek = splineKindSelector.selectedIndex === 0;
  tensionInput.disabled = !isKochanek;
  biasInput.disabled = !isKochanek;
  continuityInput.disabled = !isKochanek;
  const kind = isKochanek
    ? splineKind.KOCHANEK_SPLINE
    : splineKind.CARDINAL_SPLINE;
  widget.getWidgetState().setSplineKind(kind);
  renderWindow.render();
};
splineKindSelector.addEventListener('change', onSplineKindSelected);
onSplineKindSelected();

const resolutionInput = document.querySelector('.resolution');
const onResolutionChanged = () => {
  widgetRepresentation.setResolution(resolutionInput.value);
  renderWindow.render();
};
resolutionInput.addEventListener('input', onResolutionChanged);
onResolutionChanged();

const handleSizeInput = document.querySelector('.handleSize');
const onHandleSizeChanged = () => {
  widgetRepresentation.setHandleSizeInPixels(handleSizeInput.value);
  renderWindow.render();
};
handleSizeInput.addEventListener('input', onHandleSizeChanged);
onHandleSizeChanged();

const allowFreehandCheckBox = document.querySelector('.allowFreehand');
const onFreehandEnabledChanged = () => {
  widgetRepresentation.setAllowFreehand(allowFreehandCheckBox.checked);
};
allowFreehandCheckBox.addEventListener('click', onFreehandEnabledChanged);
onFreehandEnabledChanged();

const freehandDistanceInput = document.querySelector('.freehandDistance');
const onFreehandDistanceChanged = () => {
  widgetRepresentation.setFreehandMinDistance(freehandDistanceInput.value);
};
freehandDistanceInput.addEventListener('input', onFreehandDistanceChanged);
onFreehandDistanceChanged();

const placeWidgetButton = document.querySelector('.placeWidget');
placeWidgetButton.addEventListener('click', () => {
  widgetRepresentation.reset();
  widgetManager.grabFocus(widget);
  placeWidgetButton.blur();
  
});