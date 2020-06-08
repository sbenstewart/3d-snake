var canvas = document.getElementById("render-canvas");
var engine = new BABYLON.Engine(canvas);
var scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
var light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), scene);

var torus = BABYLON.Mesh.CreateTorus("torus", 4, 1, 100, scene);
torus.rotation.x = -0.8;
torus.rotation.y = -0.8;

var torusMaterial = new BABYLON.StandardMaterial("material", scene);
torusMaterial.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);
torus.material = torusMaterial;

var t = 0;
var renderLoop = function () {
    scene.render();
    t -= 0.01;
    // animation code goes here
    torus.rotation.x = t*2;
    torus.rotation.y = t*2;
};
engine.runRenderLoop(renderLoop);