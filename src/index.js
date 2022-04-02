import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkCircleSource from '@kitware/vtk.js/Filters/Sources/CircleSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

const controlPanel = `
<table>
  <tr>
    <td>Radius</td>
    <td colspan="3">
      <input class='radius' type="range" min="0.5" max="2.0" step="0.1" value="1.0" />
    </td>
  </tr>
  <tr>
    <td>Resolution</td>
    <td colspan="3">
      <input class='resolution' type="range" min="4" max="100" step="1" value="6" />
    </td>
  </tr>
  <tr>
    <td>Show Edges</td>
    <td colspan="3">
      <input class='lines' type="checkbox" checked />
    </td>
  </tr>
  <tr>
    <td>Show Face</td>
    <td colspan="3">
      <input class='face' type="checkbox" checked />
    </td>
  </tr>
<tr style="text-align: center;">
    <td></td>
    <td>X</td>
    <td>Y</td>
    <td>Z</td>
  </tr>
  <tr>
    <td>Origin</td>
    <td>
      <input style="width: 50px" class='center' data-index="0" type="range" min="-1" max="1" step="0.1" value="0" />
    </td>
    <td>
      <input style="width: 50px" class='center' data-index="1" type="range" min="-1" max="1" step="0.1" value="0" />
    </td>
    <td>
      <input style="width: 50px" class='center' data-index="2" type="range" min="-1" max="1" step="0.1" value="0" />
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
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

function createCirclePipeline() {
  const cylinderSource = vtkCircleSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  cylinderSource.setLines(true);
  cylinderSource.setFace(true);

  actor.setMapper(mapper);
  mapper.setInputConnection(cylinderSource.getOutputPort());

  renderer.addActor(actor);
  return { cylinderSource, mapper, actor };
}

const pipelines = [createCirclePipeline()];
pipelines[0].actor.getProperty().setColor(1, 0, 0);

renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

['radius', 'resolution'].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    const value = Number(e.target.value);
    pipelines[0].cylinderSource.set({ [propertyName]: value });
    renderWindow.render();
  });
});

['lines', 'face'].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    pipelines[0].cylinderSource.set({ [propertyName]: e.target.checked });
    renderWindow.render();
  });
});

const centerElems = document.querySelectorAll('.center');

function updateTransformedCircle() {
  const center = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    center[Number(centerElems[i].dataset.index)] = Number(centerElems[i].value);
  }
  pipelines[0].cylinderSource.set({ center });
  renderWindow.render();
}

for (let i = 0; i < 3; i++) {
  centerElems[i].addEventListener('input', updateTransformedCircle);
}

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.pipelines = pipelines;
global.renderer = renderer;
global.renderWindow = renderWindow;
