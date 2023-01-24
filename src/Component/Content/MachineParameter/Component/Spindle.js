import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import "./App.css";
import { Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";

// Constants

const Spindle = ({ spindleOn, setIsLoading, x, y, z }) => {
    const isOn = useRef(false);
    const positionX = useRef(x);
    const positionY = useRef(y);
    const positionZ = useRef(z);

    var camera,
        scene,
        renderer,
        cameraControls,
        target,
        axesHelper,
        spindle,
        cube,
        model;
    const clock = new THREE.Clock();

    function init() {
        var container = document.getElementById("container");
        model = document.getElementById("content-3d-model");

        // Create raycaster and pointer variable

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "low-power",
        });
        renderer.autoClear = true;
        // camera
        camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.set(0, 70, 160);

        cameraControls = new OrbitControls(camera, renderer.domElement);
        cameraControls.target.set(0, 40, 0);
        cameraControls.maxDistance = 400;
        cameraControls.minDistance = 10;
        cameraControls.maxPolarAngle = Math.PI / 2;
        cameraControls.enableDamping = true;
        cameraControls.update();

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x8fb6e5);
        //

        const targetGeometry = new THREE.SphereGeometry(1);
        const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        target = new THREE.Mesh(targetGeometry, targetMaterial);
        target.position.y = 50;
        // scene.add(target);

        const planeGeo = new THREE.PlaneGeometry(300, 150);
        // walls
        const planeTop = new THREE.Mesh(
            planeGeo,
            new THREE.MeshPhongMaterial({ color: 0xffffff })
        );
        planeTop.position.y = 150;
        planeTop.rotateX(Math.PI / 2);
        scene.add(planeTop);
        const planeBottom = new THREE.Mesh(
            planeGeo,
            new THREE.MeshPhongMaterial({ color: 0xffffff })
        );
        planeBottom.rotateX(-Math.PI / 2);
        scene.add(planeBottom);

        const planeBack = new THREE.Mesh(
            planeGeo,
            new THREE.MeshPhongMaterial({ color: 0x1d4e77 })
        );
        planeBack.position.z = -75;
        planeBack.position.y = 75;
        scene.add(planeBack);

        const planeFront = new THREE.Mesh(
            planeGeo,
            new THREE.MeshPhongMaterial({ color: 0x1d4e77 })
        );
        planeFront.position.z = 75;
        planeFront.position.y = 75;
        planeFront.rotateY(Math.PI);
        scene.add(planeFront);

        const planeRight = new THREE.Mesh(
            new THREE.PlaneGeometry(150, 150),
            new THREE.MeshPhongMaterial({ color: 0x1d4e77 })
        );
        planeRight.position.x = 150;
        planeRight.position.y = 75;
        planeRight.rotateY(-Math.PI / 2);
        scene.add(planeRight);

        const planeLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(150, 150),
            new THREE.MeshPhongMaterial({ color: 0x1d4e77 })
        );
        planeLeft.position.x = -150;
        planeLeft.position.y = 75;
        planeLeft.rotateY(Math.PI / 2);
        scene.add(planeLeft);

        // lights
        const mainLight = new THREE.PointLight(0x8fb6e5, 1, 250);
        mainLight.position.y = 50;
        scene.add(mainLight);

        const greenLight = new THREE.PointLight(0x8fb6e5, 0.25, 1000);
        greenLight.position.set(550, 50, 0);
        scene.add(greenLight);

        const redLight = new THREE.PointLight(0x8fb6e5, 0.25, 1000);
        redLight.position.set(-550, 50, 0);
        scene.add(redLight);

        const blueLight = new THREE.PointLight(0x8fb6e5, 0.25, 1000);
        blueLight.position.set(0, 50, 550);
        scene.add(blueLight);

        //

        const geometry = new THREE.BoxGeometry(200, 10, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0x1d4e77 });
        cube = new THREE.Mesh(geometry, material);
        cube.position.y = 5;
        scene.add(cube);
        //

        axesHelper = new THREE.AxesHelper(50);
        axesHelper.position.y = 10;
        scene.add(axesHelper);

        //
        scene.add(new THREE.AmbientLight(0x8fb6e5, 0.7));
        const loader = new STLLoader();
        loader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/spindle/spindle.stl",
            function (geometry) {
                const material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x111111,
                    shininess: 2030,
                    reflectivity: 20,
                });

                const mesh = new THREE.Mesh(geometry, material);

                // mesh.position.set(0, -0.25, 0.6);
                mesh.rotateX(Math.PI);
                // mesh.rotateY(Math.PI / 2);

                mesh.position.y = 50;
                mesh.scale.set(1, 1, 1);

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                spindle = mesh;

                scene.add(spindle);
            }
        );
        //

        renderer.setPixelRatio(model.devicePixelRatio);
        renderer.setSize(
            model.clientWidth === 0 ? 849 : model.clientWidth,
            model.clientHeight === 0 ? 413 : model.clientHeight
        );
        container.appendChild(renderer.domElement);

        render();
    }

    let onWindowResize = function () {
        var box = model.getBoundingClientRect();
        camera.aspect = box.width / box.height;
        camera.updateProjectionMatrix();
        renderer.setSize(
            model.clientWidth === 0 ? 849 : model.clientWidth,
            model.clientHeight === 0 ? 413 : model.clientHeight
        );
    };

    

    function render() {
        requestAnimationFrame(render);
        TWEEN.update();
        const delta = clock.getDelta();
        if (spindle !== undefined) {
            // if (isOn.current) {
            //     spindle.rotation.y += 0.1;
            //     cameraControls.enableZoom = false;
            //     cameraControls.enablePan = false;
            //     cameraControls.enableRotate = false;
            // } else {
            //     cameraControls.enableZoom = true;
            //     cameraControls.enablePan = true;
            //     cameraControls.enableRotate = true;
            // }
            spindle.rotation.y += 0.1;
            cameraControls.enableZoom = true;
            cameraControls.enablePan = true;
            cameraControls.enableRotate = true;
        }
        target.rotation.z += delta * 0.5;
        renderer.render(scene, camera);
    }

    function generateTarget() {
        if (spindle !== undefined) {
            new TWEEN.Tween(spindle.position)
                .to(
                    {
                        x: positionX.current,
                        y: positionY.current,
                        z: positionZ.current,
                    },
                    500
                )
                .easing(TWEEN.Easing.Linear.None)
                .start();
            isOn.current = true;
            const targetPosition = new Vector3(
                positionX.current,
                positionY.current,
                positionZ.current
            );

            const geometry = new THREE.BoxGeometry(1, 0.1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            cube = new THREE.Mesh(geometry, material);
            cube.position.set(positionX.current, 10, positionZ.current);

            new TWEEN.Tween(spindle.position)
                .to(targetPosition, 500)
                .start()
                .onComplete(() => {
                    scene.add(cube);
                });
        }
    }

    useEffect(() => {
        // console.log(spindleOn);
        let intervalId;
        if (spindleOn) {
            // setIsLoading((prev) => {
            //     prev.spindle = true;
            //     return { ...prev };
            // });
            // const TimeOut = setTimeout(() => {
            init();
            intervalId = setInterval(function () {
                generateTarget();
            }, 1000);
            setIsLoading((prev) => {
                prev.spindle = false;
                return { ...prev };
            });
            // }, 1000);
            // return () => clearTimeout(TimeOut);
        }

        return () => {
            if (scene) {
                scene.remove();
            }
            clearInterval(intervalId);
        };
    }, [spindleOn]);

    useEffect(() => {
        positionX.current = x;
        positionY.current = y ? (y < 28.5 ? 28.5 : y) : null;
        positionZ.current = z;
    }, [x, y, z]);

    return (
        <>
            <div id='container' className='canvas' />
        </>
    );
};

export default Spindle;
