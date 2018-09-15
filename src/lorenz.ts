import * as Three from 'three'

export function* attractorGenerator(point: Three.Vector3, sigma: number, rho: number, beta: number, delta: number): IterableIterator<Three.Vector3> {
    yield point
    while (true) {
        yield point.add(
            new Three.Vector3(
                sigma * (point.y - point.x), point.x * (rho - point.z) - point.y, point.x * point.y - beta * point.z
            ).multiplyScalar(delta)
        )
    }
}