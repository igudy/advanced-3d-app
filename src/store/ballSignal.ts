/**
 * Football color signal — module-level, no React re-renders.
 * The Football component reads `ballState.color` inside useFrame and lerps
 * its material color toward it. Customize swatches and the variant carousel
 * call setBallColor() to push a new target.
 */

export const ballState = {
  color: '#4A1F10', // matches initial Variant (Classic Leather)
}

export function setBallColor(hex: string) {
  ballState.color = hex
}
