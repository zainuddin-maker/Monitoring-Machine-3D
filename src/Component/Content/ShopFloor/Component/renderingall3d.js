import React, { useEffect, useState, useRef } from "react";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
// import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import "./App.css";

import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import html2canvas from "html2canvas";
// Constants
// const CELL_LENGTH = 10;
const position_y = 10;
const getStatusColor = (status) => {
    switch (status) {
        case "running":
            return "#59BA56";

        case "idle":
            return "#38B4DF";

        case "hold":
            return "#FFB71B";

        case "stop":
            return "#FA604B";

        default:
            return "#8899AB";
    }
};
const getStatusChines = (status) => {
    switch (status) {
        case "running":
            return "运行";

        case "idle":
            return "空闲";

        case "hold":
            return "暂停";

        case "stop":
            return "停机";

        default:
            return "离线";
    }
};

var arraytagvaluetostatus = [
    {
        status: "idle",
        tagstatus: "0",
    },
    {
        status: "stop",
        tagstatus: "1",
    },
    {
        status: "hold",
        tagstatus: "2",
    },
    {
        status: "running",
        tagstatus: "3",
    },
];

const Renderall3d = ({
    fullmap,
    changemap,
    assetstatus,
    lastTagStatus,
    datenow,
    t,
}) => {
    // const loader = new GLTFLoader();
    const canvasRef = useRef(null);
    const valueRef = useRef(null);
    const lateststatus = useRef(lastTagStatus);

    // Reference for the canvas
    const [asset, setAsset] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [assetPop, setAssetPop] = useState(false);
    const [showAssetList, setShowAssetList] = useState(false);
    const [hover, setHover] = useState(null);

    let scene,
        renderer,
        camera,
        gui,
        model,
        // cubeGeo,
        // cubeMaterial,
        grid,
        axesHelper,
        // plane,
        // geometry,
        raycaster,
        pointer,
        // outlinePass,
        outlineSelectedObj,
        outlineHover,
        // manager,
        composer,
        renderPass,
        controls,
        controlnew,
        elf,
        effectFXAA;
    let params = {
        lock: false,
        colors: [],
        grid: true,
        axes: true,
        "show detail": false,
    };
    // let newAsset = null;
    const objects = [];
    // let selectedObj = [];
    let isShiftDown = false;
    //  let   isEscDown = false;
    let stats;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const vertex = new THREE.Vector3();
    const color = new THREE.Color();

    let materialconec4;
    let materialconec5;
    let materialcone;
    let materialconecx;
    let materialconec9;
    let materialconec10;
    // let newAsset = null;

    let rollOverMesh, rollOverMaterial;
    function init() {
        var container = document.getElementById("container");

        model = document.getElementById("render-map-3d");
        // const canvas = document.querySelector("#canvas");
        raycaster = new THREE.Raycaster();

        pointer = new THREE.Vector2();

        renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
        });

        // const renderer = new THREE.WebGLRenderer({canvas});

        renderer.setClearColor(0x08091b, 1);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeaeaea);
        // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );

        camera.position.set(-150, 80, 900);
        // camera.lookAt(0, 0, 0);

        // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        // // camera.position.y = 10;
        //  camera.position.set(0, 1800, 1300);

        composer = new EffectComposer(renderer);

        //menampilkan pada display
        renderPass = new SSAARenderPass(scene, camera);
        // renderPass.clear = false;
        composer.addPass(renderPass);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-3, 10, -10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 4;
        dirLight.shadow.camera.bottom = -4;
        dirLight.shadow.camera.left = -4;
        dirLight.shadow.camera.right = 4;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;

        const containerWidth = 1500;
        const containerDepth = 20;
        const containerHeight = 1000;
        const groundGeometry = new THREE.BoxGeometry(
            containerWidth,
            containerDepth,
            containerHeight
        );

        const loader = new THREE.TextureLoader();

        // const rollOverGeo = new THREE.BoxGeometry(60, 120, 90);
        // rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0x15598f }); //7a7979
        // var material = new THREE.ShaderMaterial({
        //     uniforms: {
        //         thickness: {
        //             value: 1.5,
        //         },
        //     },
        //     vertexShader: vertexShader,
        //     fragmentShader: fragmentShader,
        // });
        // rollOverMesh = new THREE.Mesh(rollOverGeo, material);

        // const groundMaterial = new THREE.MeshLambertMaterial({
        //     map: loader.load(
        //         ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
        //             "/filerepository/CAD-IT/uploadFileFromAPI/asset_image/landofthaichang.png"
        //     ),
        //     transparent: true,
        //     // opacity: 0.5,
        // });
        // const ground = new THREE.Mesh(groundGeometry, rollOverMaterial);
        // const ground2 = new THREE.Mesh(groundGeometry, groundMaterial);

        // scene.add(ground);
        // scene.add(ground2);

        const loadingManager = new THREE.LoadingManager(function () {
            scene.add(elf);
        });

        // // collada

        let Colladaloader = new ColladaLoader(loadingManager);

        outlineSelectedObj = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera
        );
        outlineHover = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera
        );
        composer.addPass(outlineSelectedObj);
        composer.addPass(outlineHover);

        const geometrycone = new THREE.ConeGeometry(15, 40, 32, 1);
        materialcone = new THREE.MeshBasicMaterial({ color: 0x8899ab });
        materialconec4 = new THREE.MeshBasicMaterial({ color: 0x8899ab });
        materialconec5 = new THREE.MeshBasicMaterial({ color: 0x8899ab });
        materialconecx = new THREE.MeshBasicMaterial({ color: 0x8899ab });
        materialconec9 = new THREE.MeshBasicMaterial({ color: 0x8899ab });
        materialconec10 = new THREE.MeshBasicMaterial({ color: 0x8899ab });

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/changfang.dae",
            function (collada) {
                // const cone = new THREE.Mesh(geometrycone, materialcone);
                elf = collada.scene;

                elf.scale.set(0.58, 0.5, 0.75);
                elf.position.y = 60;
                // // elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = -290;
                elf.position.z = -185 -50;
                // cone.position.y = 100;
                // cone.rotation.z = Math.PI;
                // cone.position.x = -620;
                // cone.position.z = 390;
                // scene.add(cone);
                scene.add(elf);
            }
        );

        // Colladaloader.load(
        //     ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
        //         "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/shopfloor.DAE",
        //     function (collada) {
        //         // const cone = new THREE.Mesh(geometrycone, materialcone);
        //         elf = collada.scene;

        //         elf.scale.set(1.38, 1, 1.8);
        //         elf.position.y = -30;
        //         // // elf.rotation.y = (1 / 2) * Math.PI;
        //         elf.position.x = 0;
        //         elf.position.z = -50;
           
        //         scene.add(elf);
        //     }
        // );

        //C11

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/CARVER800.DAE",
            function (collada) {

              const  posx = -620 ,
                posy = 10 ,
                posz = 380

                elf = collada.scene;

                elf.scale.set(0.1, 0.1, 0.1);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
             
                scene.add(elf);


 
                make_box_and_cone("C11" , "CARVER800"  , materialcone  , posx  ,posy + 90 ,posz +10 , posx  ,posy+ 60 ,posz +10)

            

            }
        );

        //E6

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/EDM-157015A.DAE",
            function (collada) {
                
                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                const posx = -49;
                const posz = 30;
                const posy = 10;
                elf.position.y = posy;
                // elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);



           

                make_box_and_cone("E6" , "CNC-1570/15A"  , materialcone  , posx  ,posy + 90 ,posz  , posx  ,posy+ 60 ,posz )



            }
        );

        //E2

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/EDM-341S.DAE",
            function (collada) {
               
                elf = collada.scene;

                const posx = -400;

                const posz = -130;
                const posy = 0;
                elf.scale.set(0.15, 0.15, 0.15);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;

                scene.add(elf);



                make_box_and_cone("E2" , "CNC341S"  , materialcone  , posx  ,posy + 90 ,posz  , posx  ,posy+ 60 ,posz )



            
            }
        );

        //E1

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/EDM-341S.DAE",
            function (collada) {
                
                elf = collada.scene;

                const posx = -400;

                const posz = -230;
                const posy = 0;
                elf.scale.set(0.15, 0.15, 0.15);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);
            

                make_box_and_cone("E1" , "CNC341S"  , materialcone  , posx  ,posy + 90 ,posz  , posx  ,posy+ 60 ,posz )
      
                
             
            }
        );
        //E3
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/EDM-341S.DAE",
            function (collada) {
               
                elf = collada.scene;

                const posx = -400;

                const posz = 160;
                const posy = 0;
                elf.scale.set(0.15, 0.15, 0.15);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);


   
                make_box_and_cone("E3" , "CNC341S"  , materialcone  , posx  ,posy + 90 ,posz  , posx  ,posy+ 60 ,posz )

               
            }
        );

           //E4
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/EDM-341S.DAE",
            function (collada) {
              
                elf = collada.scene;
                const posx = -400;

                const posz = 310;

                const posy = 0;
                elf.scale.set(0.15, 0.15, 0.15);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;

                scene.add(elf);


                make_box_and_cone("E3" , "CNC341S"  , materialcone  , posx  ,posy + 90 ,posz  , posx  ,posy+ 60 ,posz )
            

              
            }
        );
        //KGS-306AH M2
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/KGS-306AH.DAE",
            function (collada) {
              
                elf = collada.scene;
                const posx = -350;
                const posz = -400;
                const posy = 0;
                elf.scale.set(0.25, 0.25, 0.25);
                elf.position.y = posy;
                // elf.rotation.y = -(1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);


                make_box_and_cone("M2" , "KGS-306AH"  , materialcone  , posx +10  ,posy + 90 ,posz -10  , posx +10  ,posy + 65 ,posz -10 )

               
            }
        );

        //LSG-1640AHD（M1）
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/LSG-1640AHD.DAE",
            function (collada) {
              
                elf = collada.scene;
                const posx = -180;
                const posz = -300;
                const posy = 0;
                elf.scale.set(0.25, 0.25, 0.25);
                elf.position.y = posy;
                elf.rotation.y = -(1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

              

                make_box_and_cone("M1" , "LSG-1640AHD"  , materialcone  , posx -10  ,posy + 90 ,posz +10  , posx -10  ,posy + 60 ,posz +10)

              
            }
        );

        //LSG-618S（M7）
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/LSG-618S.DAE",
            function (collada) {
             
                elf = collada.scene;
                const posx = -350;
                const posz = -310;
                const posy = 0;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                // elf.rotation.y = -(1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);



                make_box_and_cone("M7" , "LSG-618S"  , materialcone  , posx +10  ,posy + 90 ,posz -10  , posx +10  ,posy + 60 ,posz -10)
              

               
            }
        );

        //LSG-618S（M6）
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/LSG-618S.DAE",
            function (collada) {
               
                elf = collada.scene;
                const posx = -350;
                const posz = -270;
                const posy = 0;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                // elf.rotation.y = -(1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);


                make_box_and_cone("M6" , "LSG-618S"  , materialcone  , posx +10 ,posy + 90 ,posz -10  , posx +10 ,posy + 60 ,posz -10)
              

           
                
            }
        );

        //LSG-618S（M5）
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/LSG-618S.DAE",
            function (collada) {
             
                elf = collada.scene;

                const posx = -350;

                const posz = -230;
                const posy = 0;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                // elf.rotation.y = -(1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);


                make_box_and_cone("M5" , "LSG-618S"  , materialcone  , posx +10 ,posy + 90 ,posz -10  , posx +10 ,posy + 60 ,posz -10)

               
            }
        );

        //LSG-618S（M4）
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/LSG-618S.DAE",
            function (collada) {
                
                elf = collada.scene;

                const posx = -350;

                const posz = -190;
                const posy = 0;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                // elf.rotation.y = -(1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);
            
                make_box_and_cone("M4" , "LSG-618S"  , materialcone  , posx +10 ,posy + 90 ,posz -10  , posx +10 ,posy + 60 ,posz -10)

              
            }
        );
            //E8 TURBO 1500

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/EDM-TURBO 1500.DAE",
            function (collada) {
               

                const posx = 41;
                const posy = 10;
                const posz = 30;
                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                // elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);


                make_box_and_cone("M4" , "LSG-618S"  , materialcone  , posx  ,posy + 90 ,posz   , posx  ,posy + 60 ,posz)
    
            }
        );
            //C1 FIDIA K199
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/FIDIA K199.DAE",
            function (collada) {
               

                const posx = 95;
                const posy = 30;
                const posz = 200;
                elf = collada.scene;
                elf.scale.set(0.3, 0.2, 0.1);
                elf.position.y = posy;
                elf.rotation.y = (-1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);


                make_box_and_cone("C1" , "FIDIA K199"  , materialcone  , posx + 20  ,posy + 90 ,posz + 60   , posx + 20  ,posy + 60 ,posz + 60)


               
            }
        );

        //VP2012 C7

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/VP2012.DAE",
            function (collada) {
             

                const posx = 115;
                const posy = 10;
                const posz = 35;
                elf = collada.scene;
                elf.scale.set(0.1, 0.1, 0.1);
                elf.position.y = posy;
                // elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);



                make_box_and_cone("C7" , "VP2012"  , materialcone  , posx   ,posy + 90 ,posz , posx  ,posy + 60 ,posz )


               
            }
        );

        //MCV-1100 C3

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/MCV-1100.DAE",
            function (collada) {
                

                const posx = 255;
                const posy = 10;
                const posz = 15;
                elf = collada.scene;
                elf.scale.set(0.25, 0.25, 0.25);
                elf.position.y = posy;
                // elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

  

                make_box_and_cone("C3" , "MCV-1100"  , materialcone  , posx -40   ,posy + 90 ,posz , posx -40  ,posy + 60 ,posz )


               
            }
        );
        //MCV-850 C6
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/MCV-850.DAE",
            function (collada) {
               

                const posx = 275;
                const posy = 10;
                const posz = 40;
                elf = collada.scene;
                elf.scale.set(0.25, 0.25, 0.25);
                elf.position.y = posy;
                // elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

                make_box_and_cone("C6" , "MCV-850"  , materialcone  , posx +20   ,posy + 90 ,posz -10 , posx +20  ,posy + 60 ,posz -10 )
    

                
            }
        );

        // MHB101508C  MHB101508C

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/MHB101508C.DAE",
            function (collada) {
              
                const posx = 30;
                const posy = 10;
                const posz = 200;
                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                elf.rotation.y = (-1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

                make_box_and_cone("MHB101508C" , "MHB101508C"  , materialcone  , posx    ,posy + 90 ,posz +5 , posx  ,posy + 60 ,posz +5 )
     

           
            }
        );

      


        function make_box_and_cone(id , asset_number , varmaterialcone  , conex ,coney ,conez ,box_x ,box_y ,box_z){

            let containerhtml =
            document.getElementById("containerhtml"); /* full page */
              let changeassetid = document.getElementById("changeassetid");
    
              let changestatus =
              document.getElementById("statusmachine"); 
    
              changeassetid.textContent = id;
              changestatus.textContent = "离线"

            if (
                assetstatus.findIndex(
                    (element) => element.asset_number === asset_number
                ) !== -1
            ) {
                varmaterialcone.color.set(
                    getStatusColor(
                        assetstatus[
                            assetstatus.findIndex(
                                (element) =>
                                    element.asset_number === asset_number
                            )
                        ].tag_value
                    )
                );

            
                changestatus.textContent = getStatusChines(assetstatus[
                    assetstatus.findIndex(
                        (element) =>
                            element.asset_number === asset_number
                    )
                ].tag_value)


            }
      

            const cone = new THREE.Mesh(geometrycone, varmaterialcone);
        

            cone.position.y = coney;
            cone.rotation.z = Math.PI;
            cone.position.x = conex;
            cone.position.z = conez;
            scene.add(cone);
            

            html2canvas(containerhtml, {scale: 2, }).then(function (
                canvas
            ) {
                const textureLoader = new THREE.TextureLoader();

                const mapB = textureLoader.load(canvas.toDataURL());

                const materialB = new THREE.SpriteMaterial({ 
                    map: mapB,
                    opacity:0.7, 
                    fog: true,
                });

            

                const spriteb = new THREE.Sprite(materialB);

                // spriteb.position.set( 8, 30, 2 );

                spriteb.position.y = box_y;
                // spriteb.rotation.z = Math.PI;
                spriteb.position.x = box_x;
                spriteb.position.z = box_z;
                spriteb.scale.set(20, 10, 5);

                scene.add(spriteb);

                // var link = document.createElement("a");
                // document.body.appendChild(link);
                // link.download = "html_image.jpg";
                // link.href = canvas.toDataURL();
                // link.target = '_blank';
                // link.click();
            });
        }


        //C4 YCM-YM106A

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/YCM-YM106A.DAE",
            function (collada) {
                const posx = -620 - 20;
                const posy = 10;
                const posz = 280;

                elf = collada.scene;
                elf.scale.set(0.3, 0.3, 0.3);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

                make_box_and_cone("C4" , "MFTC-2-04-004"  , materialconec4  , posx + 30 ,posy + 90 ,posz - 30 ,posx + 30 ,posy + 60 ,posz - 30)
 
            }
        );

        //C5 YCM-YM106A

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/YCM-YM106A.DAE",
            function (collada) {
                const posx = -620 - 20;
                const posy = 10;
                const posz = 140;

                elf = collada.scene;
                elf.scale.set(0.3, 0.3, 0.3);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

               

                
                make_box_and_cone("C5" , "MFTC-2-04-005"  , materialconec5  , posx + 30 ,posy + 90 ,posz - 30 ,posx + 30 ,posy + 60 ,posz - 30)

             
            }
        );

        //C10 F5

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/F5.DAE",
            function (collada) {
                const posx = -580;
                const posy = 10;
                const posz = 30;

                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

          
         
                make_box_and_cone("C10" , "MFTC-2-04-010"  , materialconec10  , posx -20 ,posy + 95 ,posz - 30 ,posx -20 ,posy + 68 ,posz - 30)   
              
            }
        );

        //C9 F5

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/F5.DAE",
            function (collada) {
                const posx = -580;
                const posy = 10;
                const posz = -110;
                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

               
                make_box_and_cone("C9" , "MFTC-2-04-009"  , materialconec9  , posx -20 ,posy + 95 ,posz - 30 ,posx -20 ,posy + 68 ,posz - 30) 
              
            }
        );
            //dukin
        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/duk.DAE",
            function (collada) {
              

                const posx = 30;
                const posy = 0;
                const posz = 350;
                elf = collada.scene;
                elf.scale.set(0.25, 0.25, 0.25);
                elf.position.y = posy;
                elf.rotation.y = (-1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);



                make_box_and_cone("Dukin" , "Dukin"  , materialcone  , posx  ,posy + 90 ,posz +10 ,posx ,posy + 60 ,posz +10) 

            }
        );

        //KXZ -1814-200T

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/KXZ -1814-200T.DAE",
            function (collada) {
               

                const posx = 510;
                const posy = 0;
                const posz = 20;
                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);




                  make_box_and_cone("KXZ -1814-200T" , "KXZ -1814-200T"  , materialcone  , posx +15  ,posy + 160 ,posz -10 ,posx +15,posy + 130 ,posz -10) 


       
               
            }
        );

        Colladaloader.load(
            ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/filerepository/CAD-IT/uploadFileFromAPI/3dshopfloor/SHUNXING-350JM .DAE",
            function (collada) {
               

                const posx = 510;
                const posy = 0;
                const posz = 90;
                elf = collada.scene;
                elf.scale.set(0.2, 0.2, 0.2);
                elf.position.y = posy;
                elf.rotation.y = (1 / 2) * Math.PI;
                elf.position.x = posx;
                elf.position.z = posz;
                scene.add(elf);

         

               make_box_and_cone("SHUNXING-350JM" , "SHUNXING-350JM"  , materialcone  , posx +15  ,posy + 160 ,posz -10 ,posx +15,posy + 130 ,posz -10) 

               
            }
        );

        // Colladaloader.load(
        //     "http://localhost:3000/repository/asset/image/filedae/torno+sin+cotas/model.dae",
        //     function (collada) {
        //         elf = collada.scene;
        //         elf.scale.set(0.7, 0.7, 0.7);
        //         elf.position.y = 20;
        //         elf.position.x = -250;
        //         elf.position.z = -250;
        //         scene.add(elf);
        //         outlineSelectedObj.selectedObjects.push(elf);
        //         //////////////console.log("outlineSelectedObj");
        //         //////////////console.log(outlineSelectedObj);
        //         outlineSelectedObj.visibleEdgeColor.set("#0DC540");
        //         outlineSelectedObj.edgeStrength = Number(10);
        //         outlineSelectedObj.edgeThickness = Number(1);
        //         outlineSelectedObj.pulsePeriod = Number(3);
        //     }
        // );

        // grid = new THREE.GridHelper(1000, 20, 0x00192d, 0xffffff);

        // grid.position.y = 10;

        // // scene.add(grid)

        axesHelper = new THREE.AxesHelper(1000);

        // controls = new OrbitControls(camera, renderer.domElement);

        // controls.minPolarAngle = 0;
        // controls.maxPolarAngle = Math.PI / 2;
        // // controls.maxDistance = window.innerWidth;
        // controls.minDistance = 200;
        // controls.maxZoom = 1000;

        // renderer.setPixelRatio(model.devicePixelRatio);
        // renderer.setSize(
        //     model.clientWidth < 848 ? 848 : model.clientWidth,
        //     model.clientHeight
        // );

        controls = new PointerLockControls(camera, renderer.domElement);
        const blocker = document.getElementById("blocker");
        const instructions = document.getElementById("instructions");
        instructions.addEventListener("click", function () {
            controls.lock();
        });

        controls.addEventListener("lock", function () {
            instructions.style.display = "none";
            blocker.style.display = "none";
        });

        controls.addEventListener("unlock", function () {
            blocker.style.display = "block";
            instructions.style.display = "";
        });

        const onKeyDown = function (event) {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = true;
                    break;

                case "ArrowLeft":
                case "KeyA":
                    moveLeft = true;
                    break;

                case "ArrowDown":
                case "KeyS":
                    moveBackward = true;
                    break;

                case "ArrowRight":
                case "KeyD":
                    moveRight = true;
                    break;

                case "Space":
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;
            }
        };

        const onKeyUp = function (event) {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = false;
                    break;

                case "ArrowLeft":
                case "KeyA":
                    moveLeft = false;
                    break;

                case "ArrowDown":
                case "KeyS":
                    moveBackward = false;
                    break;

                case "ArrowRight":
                case "KeyD":
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        function createScrollEventHandler(milliseconds) {
            let allowed = true;
            return (event) => {
				//console.log("event")
				//console.log(event)
                // event.preventDefault();
                if (allowed) {
                    //console.log("wheel");

					if (event.deltaY < 0) {
						//scroll wheel up
						//console.log("up");
						moveForward = true;
					  }
					  if (event.deltaY > 0) {
						//scroll wheel down
						//console.log("down");
						moveBackward = true;
					  }
                    allowed = false;
					
                    setTimeout(() => {
                        allowed = true;
						moveForward = false;
						moveBackward = false;
                    }, milliseconds);
                }
            };
        }
        // let scrollEventHandler = createScrollEventHandler(100); // 3 seconds
        // window.addEventListener("wheel", scrollEventHandler);
        renderer.setPixelRatio(model.devicePixelRatio);
        // .setSize ( width : Integer, height : Integer, updateStyle : Boolean ) : null Resizes the output canvas to (width, height) with device pixel ratio taken into account, and also sets the viewport to fit that size, starting in (0, 0). Setting updateStyle to false prevents any style changes to the output canvas.
        renderer.setSize(model.clientWidth - 500, model.clientHeight);

        resizeCanvasToDisplaySize();
        camera.aspect =
            renderer.domElement.clientWidth / renderer.domElement.clientHeight;
        composer.setSize(renderer.domElement.width, renderer.domElement.height);

        //.updateProjectionMatrix () : null -> Updates the camera projection matrix. Must be called after any change of parameters.
        camera.updateProjectionMatrix();
        //////console.log("container")
        //////console.log(container)

        //////console.log("renderer.domElement")
        //////console.log(renderer.domElement)
        container.appendChild(renderer.domElement);

        // canvasRef.current.addEventListener("mousemove", mouseMove);
        // canvasRef.current.addEventListener("click", onPointerDown);
        // document.addEventListener("keydown", onDocumentKeyDown);
        // document.addEventListener("keyup", onDocumentKeyUp);
        // document.addEventListener("keydown", escapeKeyDown);

        // window.addEventListener("resize", onWindowResize);
        render();
    }

    // let mouseMove = function (e) {
    //     const annotation = document.querySelector(".annotation");

    //     pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    //     pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //     raycaster.setFromCamera(pointer, camera);

    //     // setHover({
    //     //     assetName: "intersectedAsset.userData.assetName",
    //     //     detail: "In geometry, a cube is a three-dimensional solid object bounded by six square faces, facets or sides, with three meeting at each vertex.",
    //     // });

    //     // const canvas = renderer.domElement;

    //     // // //////////////console.log("pointer.x");
    //     // // //////////////console.log(pointer.x);
    //     // pointer.x = Math.round(
    //     //     (0.5 + pointer.x / 2) *
    //     //         (canvas.width / window.devicePixelRatio)
    //     // );

    //     // // //////////////console.log("pointer.x");
    //     // // //////////////console.log(pointer.x);
    //     // pointer.y = Math.round(
    //     //     (0.5 - pointer.y / 2) *
    //     //         (canvas.height / window.devicePixelRatio)
    //     // );
    //     // if (annotation) {
    //     //     annotation.style.top = `${pointer.y}px`;
    //     //     annotation.style.left = `${pointer.x}px`;
    //     //     annotation.style.opacity = 1;
    //     //     annotation.style.visibility = "visible";
    //     // }

    //     const raycastList = [];

    //     scene.traverse((c) => {
    //         // if (c.isMesh && !c.disableRaycast && !c.isSprite) {
    //         raycastList.push(c);
    //         // }
    //     });

    //     //////////console.log("raycastList hover")
    //     //////////console.log(raycastList)

    //     const intersects = raycaster.intersectObjects(raycastList);
    //     //////////console.log("intersects hover")
    //     //////////console.log(intersects)

    //     if (intersects && intersects.length > 0) {
    //         let intersectedAsset = getContainerObjByChild(intersects[0].object);
    //         if (
    //             intersectedAsset &&
    //             intersectedAsset.userData &&
    //             intersectedAsset.userData.isRaycastable
    //         ) {
    //             ////////////////console.log("intersectedAsset");
    //             ////////////////console.log(intersectedAsset);
    //             // setHover({
    //             //     assetName: intersectedAsset.userData.assetName,
    //             //     detail: "In geometry, a cube is a three-dimensional solid object bounded by six square faces, facets or sides, with three meeting at each vertex.",
    //             // });
    //             // const canvas = renderer.domElement;
    //             // // ////////////////console.log("pointer.x");
    //             // // ////////////////console.log(pointer.x);
    //             // pointer.x = Math.round(
    //             //     (0.5 + pointer.x / 2) *
    //             //         (canvas.width / window.devicePixelRatio)
    //             // );
    //             // // ////////////////console.log("pointer.x");
    //             // // ////////////////console.log(pointer.x);
    //             // pointer.y = Math.round(
    //             //     (0.5 - pointer.y / 2) *
    //             //         (canvas.height / window.devicePixelRatio)
    //             // );
    //             // if (annotation) {
    //             //     annotation.style.top = `${pointer.y}px`;
    //             //     annotation.style.left = `${pointer.x}px`;
    //             //     annotation.style.opacity = 1;
    //             //     annotation.style.visibility = "visible";
    //             // }
    //             // if (
    //             //     outlineSelectedObj.selectedObjects[0] !== intersectedAsset
    //             // ) {
    //             //     outlineHover.selectedObjects = [intersectedAsset];
    //             // }
    //         } else {
    //             if (annotation) {
    //                 annotation.style.visibility = "hidden";
    //             }
    //             setHover(null);
    //             outlineHover.selectedObjects = [];
    //         }
    //     } else {
    //         if (annotation) {
    //             annotation.style.visibility = "hidden";
    //         }
    //         setHover(null);
    //         outlineHover.selectedObjects = [];
    //     }
    // };

    // let onPointerDown = function (e) {
    //     setAssetPop(false);
    //     setSelectedObject(null);
    //     const annotation = document.querySelector(".annotation");
    //     pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    //     pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //     raycaster.setFromCamera(pointer, camera);

    //     const raycastList = [];
    //     scene.traverse((c) => {
    //         if (c.isMesh && !c.disableRaycast) {
    //             raycastList.push(c);
    //         }
    //     });

    //     const intersects = raycaster.intersectObjects(raycastList);

    //     if (intersects && intersects.length > 0) {
    //         let intersectedAsset = getContainerObjByChild(intersects[0].object);
    //         if (
    //             intersectedAsset &&
    //             intersectedAsset.userData &&
    //             intersectedAsset.userData.isRaycastable
    //         ) {
    //             outlineSelectedObj.selectedObjects = [intersectedAsset];
    //             outlineHover.selectedObjects = [];
    //             let select = intersectedAsset.userData;

    //             let clickedAsset = objects.find(
    //                 (asset) => asset.userData === select
    //             );

    //             //////////////console.log("clickedAsset");
    //             //////////////console.log(clickedAsset);

    //             if (clickedAsset) {
    //                 if (isShiftDown) {
    //                     scene.remove(clickedAsset);
    //                     objects.splice(objects.indexOf(clickedAsset), 1);
    //                     if (annotation) {
    //                         annotation.style.visibility = "hidden";
    //                     }
    //                 } else {
    //                     selected(clickedAsset);
    //                 }
    //             } else {
    //             }
    //         } else {
    //             if (valueRef.current && !isShiftDown) {
    //                 const intersect = intersects[0];

    //                 //Loaders
    //                 //
    //                 var mtlLoader = new MTLLoader();
    //                 //MTLLoader - > A loader for loading an .mtl resource, used internally by OBJLoader.
    //                 //The Material Template Library format (MTL) or .MTL File Format is a companion file format to .OBJ that describes surface shading (material) properties of objects within one or more .OBJ files.

    //                 // mtlLoader.crossOrigin = true;
    //                 mtlLoader.setPath(valueRef.current.asset.path);
    //                 mtlLoader.load(
    //                     valueRef.current.asset.mtl,
    //                     function (materials) {
    //                         materials.preload();
    //                         var objLoader = new OBJLoader();
    //                         objLoader.setMaterials(materials);
    //                         objLoader.setPath(valueRef.current.asset.path);
    //                         objLoader.load(
    //                             valueRef.current.asset.obj,
    //                             function (object) {
    //                                 let leng = objects.length;
    //                                 object.position
    //                                     .copy(intersect.point)
    //                                     .add(intersect.face.normal);
    //                                 object.position
    //                                     .divideScalar(50)
    //                                     .floor()
    //                                     .multiplyScalar(50)
    //                                     .addScalar(25);
    //                                 object.position.y = position_y;
    //                                 // Set the name of the object
    //                                 object.userData = {
    //                                     isRaycastable: true,
    //                                     assetName: valueRef.current.assetName,
    //                                     assetNumber: leng,
    //                                 };

    //                                 const assetSize = {
    //                                     depth: 100 * object.scale.y,
    //                                     width: 100 * object.scale.z,
    //                                     height: 50 * object.scale.y,
    //                                 };
    //                                 // Compute the box container of the received model
    //                                 const box = new THREE.Box3().setFromObject(
    //                                     object
    //                                 );

    //                                 const modelSize = {
    //                                     depth: box.max.x - box.min.x,
    //                                     width: box.max.y - box.min.y,
    //                                     height: box.max.z - box.min.z,
    //                                 };

    //                                 let normalizedScale = {
    //                                     depth:
    //                                         assetSize.depth / modelSize.depth,
    //                                     width:
    //                                         assetSize.width / modelSize.width,
    //                                     height:
    //                                         assetSize.height / modelSize.height,
    //                                 };

    //                                 let scaleValue =
    //                                     normalizedScale.depth <
    //                                     normalizedScale.width
    //                                         ? normalizedScale.depth
    //                                         : normalizedScale.width <
    //                                           normalizedScale.height
    //                                         ? normalizedScale.width
    //                                         : normalizedScale.height;

    //                                 object.scale.set(
    //                                     scaleValue,
    //                                     scaleValue,
    //                                     scaleValue
    //                                 );

    //                                 object.rotation.y = Math.PI / 2;

    //                                 let check = objects.find(
    //                                     (o) =>
    //                                         o.position.x ===
    //                                             object.position.x &&
    //                                         o.position.z === object.position.z
    //                                 );

    //                                 // controlnew = new TransformControls( camera, renderer.domElement );
    //                                 // controlnew.addEventListener( 'change', render );

    //                                 // controlnew.addEventListener( 'dragging-changed', function ( event ) {

    //                                 //     controls.enabled = ! event.value;

    //                                 // } );

    //                                 // const sceneElement = document.createElement( 'div' );

    //                                 // object.userData.element = sceneElement;

    //                                 //  const controlsnew = new OrbitControls( camera ,renderer.domElement );
    //                                 //  controlsnew.addEventListener( 'change', render );
    //                                 // controls.minDistance = 2;
    //                                 // controls.maxDistance = 5;
    //                                 // controls.enablePan = false;
    //                                 // controls.enableZoom = false;
    //                                 // object.userData.controls = controls;

    //                                 //for drag controls
    //                                 // ////////////////console.log("")

    //                                 ////////////////console.log("object")
    //                                 ////////////////console.log(object)

    //                                 controlnew = new DragControls(
    //                                     objects,
    //                                     camera,
    //                                     renderer.domElement
    //                                 );

    //                                 //end dragcontrols

    //                                 // controlnew.addEventListener( 'drag', render );
    //                                 // controlnew.addEventListener( 'dragging-changed', function ( event ) {

    //                                 //     controls.enabled = ! event.value;

    //                                 // } );

    //                                 if (check === undefined) {
    //                                     // axesHelper = new THREE.AxesHelper(1000);
    //                                     // object.add(axesHelper);

    //                                     // const group = new THREE.Group();

    //                                     // group.add( axesHelper );
    //                                     // group.add( object );

    //                                     // controlnew.attach( object );
    //                                     scene.add(object);
    //                                     // scene.add(controlnew);

    //                                     objects.push(object);
    //                                 }

    //                                 setSelectedObject(null);
    //                                 setAssetPop(false);
    //                             }
    //                         );
    //                     }
    //                 );
    //                 outlineSelectedObj.selectedObjects = [];
    //             } else {
    //                 setSelectedObject(null);
    //                 setAssetPop(false);
    //             }
    //         }
    //     } else {
    //         setSelectedObject(null);
    //         outlineSelectedObj.selectedObjects = [];
    //     }
    // };

    // const getContainerObjByChild = (child) => {
    //     if (child && child.userData && child.userData.isRaycastable) {
    //         return child;
    //     } else if (child.parent !== null) {
    //         return getContainerObjByChild(child.parent);
    //     } else {
    //         return null;
    //     }
    // };

    // let onWindowResize = function () {

    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();

    //     renderer.setSize( window.innerWidth, window.innerHeight );

    //     // var box = model.getBoundingClientRect();
    //     // camera.aspect = box.width / box.height;
    //     // camera.updateProjectionMatrix();
    //     // renderer.setSize(box.width, box.height);
    //     // // camera.aspect =
    //     // //     renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    //     // // composer.setSize(renderer.domElement.width, renderer.domElement.height);
    //     // camera.updateProjectionMatrix();
    // };

    // let onDocumentKeyDown = function (event) {
    //     switch (event.keyCode) {
    //         case 16:
    //             isShiftDown = true;
    //             break;
    //     }
    // };

    // var onDocumentKeyUp = function (event) {
    //     switch (event.keyCode) {
    //         case 16:
    //             isShiftDown = false;
    //             break;
    //     }
    // };

    // var escapeKeyDown = function (event) {
    //     if (event !== undefined) {
    //         switch (event.keyCode) {
    //             case 27:
    //                 // isEscDown = true;
    //                 setAsset(null);
    //                 setSelectedObject(null);
    //                 setAssetPop(false);
    //                 valueRef.current = null;
    //                 break;
    //         }
    //     }
    // };

    function resizeCanvasToDisplaySize() {
        model = document.getElementById("render-map-3d");
        ////////console.log("model.clientWidth")
        ////////console.log(model.clientWidth)

        renderer.setPixelRatio(model.devicePixelRatio);
        // // .setSize ( width : Integer, height : Integer, updateStyle : Boolean ) : null Resizes the output canvas to (width, height) with device pixel ratio taken into account, and also sets the viewport to fit that size, starting in (0, 0). Setting updateStyle to false prevents any style changes to the output canvas.
        renderer.setSize(model.clientWidth - 1, model.clientHeight);
    }

    function render() {
        resizeCanvasToDisplaySize();
        requestAnimationFrame(render);
        const time = performance.now();

        if (controls.isLocked === true) {
            raycaster.ray.origin.copy(controls.getObject().position);

            raycaster.ray.origin.y -= 10;

            const intersections = raycaster.intersectObjects(objects, false);

            const onObject = intersections.length > 0;

            const delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            direction.z = Number(moveForward) - Number(moveBackward);

            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize(); // this ensures consistent movements in all directions

            if (moveForward || moveBackward)
                velocity.z -= direction.z * 4000.0 * delta;
            if (moveLeft || moveRight)
                velocity.x -= direction.x * 4000.0 * delta;

            // if ( onObject === true ) {

            // 	velocity.y = Math.max( 0, velocity.y );
            // 	canJump = true;

            // }

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);

            controls.getObject().position.y += velocity.y * delta; // new behavior

            // if ( controls.getObject().position.y < 50 ) {

            // 	velocity.y = 0;
            // 	controls.getObject().position.y = 50;

            // 	canJump = true;

            // }
        }

        prevTime = time;

        if (lateststatus.current.length > 0) {
            if (
                lateststatus.current.findIndex(
                    (element) => element.assetid === "MFTC-2-04-004"
                ) !== -1
            ) {
                if (
                    arraytagvaluetostatus.findIndex(
                        (element) =>
                            element.tagstatus ===
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-004"
                                )
                            ].tagValue
                    ) !== -1
                ) {
                    if (
                        datenow <
                        new Date(
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-004"
                                )
                            ].timestamp
                        )
                    ) {
                        materialconec4.color.set(
                            getStatusColor(
                                arraytagvaluetostatus[
                                    arraytagvaluetostatus.findIndex(
                                        (element) =>
                                            element.tagstatus ===
                                            lateststatus.current[
                                                lateststatus.current.findIndex(
                                                    (element) =>
                                                        element.assetid ===
                                                        "MFTC-2-04-004"
                                                )
                                            ].tagValue
                                    )
                                ].status
                            )
                        );
                        materialconec4.needsUpdate = true;
                    }
                }
            }

            if (
                lateststatus.current.findIndex(
                    (element) => element.assetid === "MFTC-2-04-005"
                ) !== -1
            ) {
                if (
                    arraytagvaluetostatus.findIndex(
                        (element) =>
                            element.tagstatus ===
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-005"
                                )
                            ].tagValue
                    ) !== -1
                ) {
                    if (
                        datenow <
                        new Date(
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-005"
                                )
                            ].timestamp
                        )
                    ) {
                        materialconec5.color.set(
                            getStatusColor(
                                arraytagvaluetostatus[
                                    arraytagvaluetostatus.findIndex(
                                        (element) =>
                                            element.tagstatus ===
                                            lateststatus.current[
                                                lateststatus.current.findIndex(
                                                    (element) =>
                                                        element.assetid ===
                                                        "MFTC-2-04-005"
                                                )
                                            ].tagValue
                                    )
                                ].status
                            )
                        );
                        materialconec5.needsUpdate = true;
                    }
                }
            }

            if (
                lateststatus.current.findIndex(
                    (element) => element.assetid === "MFTC-2-04-009"
                ) !== -1
            ) {
                if (
                    arraytagvaluetostatus.findIndex(
                        (element) =>
                            element.tagstatus ===
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-009"
                                )
                            ].tagValue
                    ) !== -1
                ) {
                    if (
                        datenow <
                        new Date(
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-009"
                                )
                            ].timestamp
                        )
                    ) {
                        materialconec9.color.set(
                            getStatusColor(
                                arraytagvaluetostatus[
                                    arraytagvaluetostatus.findIndex(
                                        (element) =>
                                            element.tagstatus ===
                                            lateststatus.current[
                                                lateststatus.current.findIndex(
                                                    (element) =>
                                                        element.assetid ===
                                                        "MFTC-2-04-005"
                                                )
                                            ].tagValue
                                    )
                                ].status
                            )
                        );
                        materialconec9.needsUpdate = true;
                    }
                }
            }

            if (
                lateststatus.current.findIndex(
                    (element) => element.assetid === "MFTC-2-04-010"
                ) !== -1
            ) {
                if (
                    arraytagvaluetostatus.findIndex(
                        (element) =>
                            element.tagstatus ===
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-010"
                                )
                            ].tagValue
                    ) !== -1
                ) {
                    if (
                        datenow <
                        new Date(
                            lateststatus.current[
                                lateststatus.current.findIndex(
                                    (element) =>
                                        element.assetid === "MFTC-2-04-010"
                                )
                            ].timestamp
                        )
                    ) {
                        materialconec10.color.set(
                            getStatusColor(
                                arraytagvaluetostatus[
                                    arraytagvaluetostatus.findIndex(
                                        (element) =>
                                            element.tagstatus ===
                                            lateststatus.current[
                                                lateststatus.current.findIndex(
                                                    (element) =>
                                                        element.assetid ===
                                                        "MFTC-2-04-005"
                                                )
                                            ].tagValue
                                    )
                                ].status
                            )
                        );
                        materialconec10.needsUpdate = true;
                    }
                }
            }
        }
        // composer.render();
        renderer.render(scene, camera);
    }

    useEffect(() => {
        lateststatus.current = lastTagStatus;
    }, [lastTagStatus]);



    useEffect(() => {
        init();
        return () => {
            if (scene) {
                scene.remove();
            }
        };
    }, []);

    useEffect(() => {
        init();
    }, [fullmap]);

    return (
        <>
            <div id='content' className='content'>
                <div id='blocker'>
                    <div id='instructions'>
                        <p style={{ fontSize: "36px" }}>
                            {t("content.shop_floor_overview.error.Clicktoplay")}
                        </p>
                        <p>
                            {t("content.shop_floor_overview.error.Move")}: WASD
                            <br />
                            <br />
                            {t("content.shop_floor_overview.error.Exit")} : ESC
                        </p>
                    </div>
                </div>

                <div id='container' className='canvas' />
                <canvas id='canvas' ref={canvasRef} className='canvas' />
                <div
                id='containerhtml'
                style={{
                    position: "absolute",
                    // width: "200px",
                    // height: "200px",
                    backgroundColor: "#4ad5cf",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: -1000,
                   
                }}>
                <div
                    style={{
                      
                        backgroundColor: "#4ad5cf",
                        // border: "5px solid #000000",
                        // boxSizing:"border-box",
                        borderRadius: "5px",
                        padding: "15px",
                
                        
                    }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                           justifyContent:"center",
                           alignItems:"center",
                           color:"#ffffff",
                           fontWeight:"bolder",
                           fontSize:"15px"
                        }}>
                        <div id='changeassetid' >FMC</div>
                        <div id='statusmachine'>addaseet9</div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Renderall3d;
