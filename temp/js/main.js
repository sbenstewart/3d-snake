 var demo = new CANNON.Demo();
      var size = 1;

      demo.addScene("Raycasting",function(){

        var shape = CANNON.Trimesh.createTorus(4, 3.5, 16, 16);

        // Create world
        var world = demo.getWorld();
        world.gravity.set(0,0,0);

        // particle as marker for the raycast hit
        var N = 5;
        var particleShape = new CANNON.Particle();
        var particleBodies = [];
        for(var i=0; i<N*N; i++){
          var particleBody = new CANNON.Body({
            mass: 1,
            shape: particleShape,
            collisionResponse: false
          });
          world.addBody(particleBody);
          demo.addVisual(particleBody);
          particleBodies.push(particleBody);
        }

        // Shape on plane
        var shapeBody = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0.01, 0.01, 0.01) });
        shapeBody.addShape(shape);
        shapeBody.angularVelocity.set(0,1,0);
        world.addBody(shapeBody);
        demo.addVisual(shapeBody);

        var from = new CANNON.Vec3(10,1,0);
        var to = new CANNON.Vec3(-10,1,0);
        var result = new CANNON.RaycastResult();
        var raycastOptions = {};
        var listener = function (evt) {
          for(var i=0; i<N; i++){
            for(var j=0; j<N; j++){
              from.set(
                10,
                i * 0.1,
                j * 0.1
              );
              to.set(
                -10,
                i * 0.1,
                j * 0.1
              );
              result.reset();
              world.raycastClosest(from, to, raycastOptions, result);
              particleBodies[i * N + j].position.copy(result.hitPointWorld);
            }
          }
        };
        world.addEventListener('postStep', listener);
        var destroyer = function(){
          world.removeEventListener('postStep', listener);
          demo.removeEventListener('destroy', destroyer);
        };
        demo.addEventListener('destroy', destroyer);
      });

      demo.start();