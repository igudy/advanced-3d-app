import {
  Loader,
  Material,
  Mesh,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  NoColorSpace,
  Object3D,
  SRGBColorSpace,
} from 'three'
import type { LoadingManager } from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const BASE = '/models/basketball/'
const MTL_FILE = 'nba-ball.mtl'

function upgradePhongToPhysical(root: Object3D) {
  root.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh || !mesh.material) return

    const replaceOne = (mat: MeshPhongMaterial) => {
      const map = mat.map?.clone() ?? null
      const bumpMap = mat.bumpMap?.clone() ?? null
      if (map) {
        map.colorSpace = SRGBColorSpace
        map.anisotropy = 8
        map.needsUpdate = true
      }
      if (bumpMap) {
        bumpMap.colorSpace = NoColorSpace
        bumpMap.anisotropy = 8
        bumpMap.needsUpdate = true
      }
      mat.dispose()
      return new MeshPhysicalMaterial({
        map: map ?? undefined,
        bumpMap: bumpMap ?? undefined,
        bumpScale: 0.016,
        color: '#ffffff',
        roughness: 0.9,
        metalness: 0,
        clearcoat: 0.04,
        clearcoatRoughness: 0.62,
        envMapIntensity: 0.48,
        transparent: true,
        opacity: 1,
        depthWrite: true,
      })
    }

    const mats = mesh.material
    if (Array.isArray(mats)) {
      mesh.material = mats.map((m) =>
        (m as MeshPhongMaterial).isMeshPhongMaterial
          ? replaceOne(m as MeshPhongMaterial)
          : m,
      )
    } else if ((mats as MeshPhongMaterial).isMeshPhongMaterial) {
      mesh.material = replaceOne(mats as MeshPhongMaterial)
    }
  })
}

/** Solid fallback if MTL / textures fail — still shows a ball in frame. */
function applyFallbackBasketballMaterial(root: Object3D) {
  root.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh) return
    const disposeMat = (m: Material | Material[]) => {
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m.dispose()
    }
    if (mesh.material) disposeMat(mesh.material as Material | Material[])
    mesh.material = new MeshPhysicalMaterial({
      color: '#c45c1a',
      roughness: 0.88,
      metalness: 0.02,
      clearcoat: 0.06,
      clearcoatRoughness: 0.55,
      envMapIntensity: 0.45,
      transparent: true,
      opacity: 1,
      depthWrite: true,
    })
  })
}

/** Loads NBA basketball.obj with its MTL + texture maps (correct UV atlas). */
export class BasketballOBJLoader extends Loader {
  constructor(manager?: LoadingManager) {
    super(manager)
  }

  load(
    url: string,
    onLoad: (object: Object3D) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void,
  ) {
    const manager = this.manager

    const loadBareObj = () => {
      const objLoader = new OBJLoader(manager)
      objLoader.load(
        url,
        (object) => {
          applyFallbackBasketballMaterial(object)
          onLoad(object)
        },
        onProgress,
        onError,
      )
    }

    const mtlLoader = new MTLLoader(manager)
    mtlLoader.setPath(BASE)

    mtlLoader.load(
      MTL_FILE,
      (materials) => {
        materials.preload()
        const objLoader = new OBJLoader(manager)
        objLoader.setMaterials(materials)
        objLoader.load(
          url,
          (object) => {
            try {
              upgradePhongToPhysical(object)
              onLoad(object)
            } catch (e) {
              console.warn('[BasketballOBJLoader] upgrade failed, using fallback material', e)
              applyFallbackBasketballMaterial(object)
              onLoad(object)
            }
          },
          onProgress,
          (err) => {
            console.warn('[BasketballOBJLoader] OBJ with MTL failed, loading bare OBJ', err)
            loadBareObj()
          },
        )
      },
      onProgress,
      (err) => {
        console.warn('[BasketballOBJLoader] MTL failed, loading bare OBJ', err)
        loadBareObj()
      },
    )
  }
}
