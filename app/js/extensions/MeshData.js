///////////////////////////////////////////////////////////////////////////////
// MeshData viewer extension
// by Philippe Leefsma, July 2015
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.MeshData = function (viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _self = this;

  var _lineMaterial = null;

  var _vertexMaterial = null;

  ///////////////////////////////////////////////////////////////////////////
  // load callback
  //
  ///////////////////////////////////////////////////////////////////////////
  _self.load = function () {

    _lineMaterial = createLineMaterial();

    _vertexMaterial = createVertexMaterial();

    console.log('viewer', viewer)

    // viewer.addEventListener(
    //   Autodesk.Viewing.SELECTION_CHANGED_EVENT,
    //   onSelectionChanged);

    console.log('Autodesk.ADN.Viewing.Extension.MeshData loaded');

    return true;
  };

  ///////////////////////////////////////////////////////////////////////////
  // unload callback
  //
  ///////////////////////////////////////////////////////////////////////////
  _self.unload = function () {

    console.log('Autodesk.ADN.Viewing.Extension.MeshData unloaded');

    return true;
  };

  ///////////////////////////////////////////////////////////////////////////
  // selection changed callback
  //
  ///////////////////////////////////////////////////////////////////////////
  function onSelectionChanged(event) {

    // console.log(event)

    event.fragIdsArray.forEach(function(fragId){

      getProperties(fragId);
    });

    viewer.impl.sceneUpdated(true);
  }

  function getPropertiesByFragId(fragId) {

    var fragProxy = viewer.impl.getFragmentProxy(
      viewer.model,
      fragId);

    var renderProxy = viewer.impl.getRenderProxy(
      viewer.model,
      fragId);

    fragProxy.updateAnimTransform();

    var matrix = new THREE.Matrix4();
    fragProxy.getWorldMatrix(matrix);

    var geometry = renderProxy.geometry;

    if (!geometry) {
      return {}
    }

    // console.log(geometry)

    // console.log('volume: ', meshVolume(geometry))

    var attributes = geometry.attributes

    // console.log(attributes);

    var vA = new THREE.Vector3();
    var vB = new THREE.Vector3();
    var vC = new THREE.Vector3();

    var volume = 0
    var surface_area = 0

    if (attributes.index !== undefined) {

      var indices = attributes.index.array || geometry.ib;
      var positions = geometry.vb ? geometry.vb : attributes.position.array;
      var stride = geometry.vb ? geometry.vbstride : 3;
      var offsets = geometry.offsets;

      if (!offsets || offsets.length === 0) {

        offsets = [{start: 0, count: indices.length, index: 0}];
      }

      for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {

        var start = offsets[oi].start;
        var count = offsets[oi].count;
        var index = offsets[oi].index;

        for (var i = start, il = start + count; i < il; i += 3) {

          var a = index + indices[i];
          var b = index + indices[i + 1];
          var c = index + indices[i + 2];

          vA.fromArray(positions, a * stride);
          vB.fromArray(positions, b * stride);
          vC.fromArray(positions, c * stride);

          vA.applyMatrix4(matrix);
          vB.applyMatrix4(matrix);
          vC.applyMatrix4(matrix);

          // console.log(vA,vB,vC)
          surface_area += areaOfTriangle(vA, vB, vC);
          volume += signedVolumeOfTriangle(vA, vB, vC);

          // drawVertex (vA, 0.05);
          // drawVertex (vB, 0.05);
          // drawVertex (vC, 0.05);

          // drawLine(vA, vB);
          // drawLine(vB, vC);
          // drawLine(vC, vA);
        }
      }
    }
    else {

      return {}
    }

    return ({
      surface_area: Math.abs(surface_area),
      volume: Math.abs(volume)
    })
  }

  ///////////////////////////////////////////////////////////////////////////
  // draw vertices and faces
  //
  ///////////////////////////////////////////////////////////////////////////
  _self.getProperties = function() {

    var data = viewer.model.getData()
    console.log('data', data)

    var fragIds = data.fragments.fragId2dbId
    console.log('fragIds', fragIds)
    var properties = {}
    var newProperties

    for (var i = 0; i < data.fragments.length; i++) {
      newProperties = getPropertiesByFragId(i)

      properties.volume = (properties.volume || 0) + (newProperties.volume || 0)
      properties.surface_area = (properties.surface_area || 0) + (newProperties.surface_area || 0)
    }

    properties.components = data.fragments.length
    properties.bounding_box_x = (data.bbox.max.x - data.bbox.min.x).toFixed(2)
    properties.bounding_box_y = (data.bbox.max.y - data.bbox.min.y).toFixed(2)
    properties.bounding_box_z = (data.bbox.max.z - data.bbox.min.z).toFixed(2)
    properties.surface_area = properties.surface_area.toFixed(2)
    properties.volume = properties.volume.toFixed(2)

    return properties

  }



function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}

function areaOfTriangle(p1, p2, p3) {
  var triangle = new THREE.Triangle(p1, p2, p3);
  return triangle.area()
}

  ///////////////////////////////////////////////////////////////////////////
  // vertex material
  //
  ///////////////////////////////////////////////////////////////////////////
  function createVertexMaterial() {

    var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    viewer.impl.matman().addMaterial(
      'adn-material-vertex',
      material,
      true);

    return material;
  }

  ///////////////////////////////////////////////////////////////////////////
  // line material
  //
  ///////////////////////////////////////////////////////////////////////////
  function createLineMaterial() {

    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 2
    });

    viewer.impl.matman().addMaterial(
      'adn-material-line',
      material,
      true);

    return material;
  }

  ///////////////////////////////////////////////////////////////////////////
  // draw a line
  //
  ///////////////////////////////////////////////////////////////////////////
  function drawLine(start, end) {

    var geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(
      start.x, start.y, start.z));

    geometry.vertices.push(new THREE.Vector3(
      end.x, end.y, end.z));

    var line = new THREE.Line(geometry, _lineMaterial);

    viewer.impl.scene.add(line);
  }

  ///////////////////////////////////////////////////////////////////////////
  // draw a vertex
  //
  ///////////////////////////////////////////////////////////////////////////
  function drawVertex (v, radius) {

    var vertex = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 20),
      _vertexMaterial);

    vertex.position.set(v.x, v.y, v.z);

    viewer.impl.scene.add(vertex);
  }
};

Autodesk.ADN.Viewing.Extension.MeshData.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.MeshData.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.MeshData;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.MeshData',
  Autodesk.ADN.Viewing.Extension.MeshData);

