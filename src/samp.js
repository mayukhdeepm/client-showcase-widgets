import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkArrowSource from '@kitware/vtk.js/Filters/Sources/ArrowSource';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

const controlPanel = `
<table>
  <tr>
    <td>TipResolution</td>
    <td colspan="3">
      <input class='tipResolution' type="range" min="4" max="100" step="1" value="6" />
    </td>
  </tr>
  <tr>
    <td>TipRadius</td>
    <td colspan="3">
      <input class='tipRadius' type="range" min="0.01" max="1.0" step="0.01" value="0.1" />
    </td>
  </tr>
  <tr>
    <td>TipLength</td>
    <td colspan="3">
      <input class='tipLength' type="range" min="0.1" max="0.5" step="0.05" value="0.35" />
    </td>
  </tr>
  <tr>
    <td>ShaftResolution</td>
    <td colspan="3">
      <input class='shaftResolution' type="range" min="4" max="100" step="1" value="6" />
    </td>
  </tr>
  <tr>
    <td>ShaftRadius</td>
    <td colspan="3">
      <input class='shaftRadius' type="range" min="0.01" max="1.0" step="0.01" value="0.03" />
    </td>
  </tr>
  <tr>
    <td>Invert</td>
    <td colspan="3">
      <input class='invert' type="checkbox" />
    </td>
  </tr>
  <tr style="text-align: center;">
    <td></td>
    <td>X</td>
    <td>Y</td>
    <td>Z</td>
  </tr>
  <tr>
    <td>Direction</td>
    <td>
      <input style="width: 50px" class='direction' data-index="0" type="range" min="-1" max="1" step="0.1" value="1" />
    </td>
    <td>
      <input style="width: 50px" class='direction' data-index="1" type="range" min="-1" max="1" step="0.1" value="0" />
    </td>
    <td>
      <input style="width: 50px" class='direction' data-index="2" type="range" min="-1" max="1" step="0.1" value="0" />
    </td>
  </tr>
  <tr>
    <td>
      <input class='reset' type="button" value="Reset" />
    </td>
    <td></td>
    <td></td>
    <td></td>
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

function createArrowPipeline() {
  const arrowSource = vtkArrowSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  actor.getProperty().setEdgeVisibility(true);
  actor.getProperty().setEdgeColor(1, 0, 0);
  actor.getProperty().setRepresentationToSurface();
  mapper.setInputConnection(arrowSource.getOutputPort());

  renderer.addActor(actor);
  return { arrowSource, mapper, actor };
}

const pipelines = [createArrowPipeline()];

renderer.resetCamera();
renderer.resetCameraClippingRange();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

[
  'tipResolution',
  'tipRadius',
  'tipLength',
  'shaftResolution',
  'shaftRadius',
].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    const value = Number(e.target.value);
    pipelines[0].arrowSource.set({ [propertyName]: value });
    renderer.resetCameraClippingRange();
    renderWindow.render();
  });
});

document.querySelector('.invert').addEventListener('change', (e) => {
  const invert = !!e.target.checked;
  pipelines[0].arrowSource.set({ invert });
  renderer.resetCameraClippingRange();
  renderWindow.render();
});

const directionElems = document.querySelectorAll('.direction');

function updateTransformedArrow() {
  const direction = [1, 0, 0];
  for (let i = 0; i < 3; i++) {
    direction[Number(directionElems[i].dataset.index)] = Number(
      directionElems[i].value
    );
  }
  pipelines[0].arrowSource.set({ direction });
  renderer.resetCameraClippingRange();
  renderWindow.render();
}

for (let i = 0; i < 3; i++) {
  directionElems[i].addEventListener('input', updateTransformedArrow);
}

function resetUI() {
  const defaultTipResolution = 6;
  const defaultTipRadius = 0.1;
  const defaultTipLength = 0.35;
  const defaultShaftResolution = 6;
  const defaultShaftRadius = 0.03;
  const direction = [1, 0, 0];

  document.querySelector(`.tipResolution`).value = Number(defaultTipResolution);
  pipelines[0].arrowSource.set({ tipResolution: Number(defaultTipResolution) });
  document.querySelector(`.tipRadius`).value = Number(defaultTipRadius);
  pipelines[0].arrowSource.set({ tipRadius: Number(defaultTipRadius) });
  document.querySelector(`.tipLength`).value = Number(defaultTipLength);
  pipelines[0].arrowSource.set({ tipLength: Number(defaultTipLength) });
  document.querySelector(`.shaftResolution`).value = Number(
    defaultShaftResolution
  );
  pipelines[0].arrowSource.set({
    shaftResolution: Number(defaultShaftResolution),
  });
  document.querySelector(`.shaftRadius`).value = Number(defaultShaftRadius);
  pipelines[0].arrowSource.set({ shaftRadius: Number(defaultShaftRadius) });
  document.querySelector(`.invert`).checked = false;
  pipelines[0].arrowSource.set({ invert: false });
  for (let i = 0; i < 3; i++) {
    directionElems[i].value = Number(direction[i]);
  }
  pipelines[0].arrowSource.set({ direction });

  renderer.resetCamera();
  renderer.resetCameraClippingRange();
  renderWindow.render();
}

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', resetUI);

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.pipelines = pipelines;
global.renderer = renderer;
global.renderWindow = renderWindow;