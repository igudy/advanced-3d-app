import {
  Loader,
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
const MTL_FILE = 'NBA BASKETBALL.mtl'

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
              if (onError) onError(e)
              else console.error(e)
            }
          },
          onProgress,
          onError,
        )
      },
      onProgress,
      onError,
    )
  }
}
