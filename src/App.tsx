import * as React from 'react'
import * as Three from 'three'
import { Actor, Manager } from 'three-actors'
import { BufferAttribute, BufferGeometry } from 'three';

export class App extends React.Component<{}, { sigma: number, rho: number, beta: number }> {

    state = {
        sigma: 10,
        rho: 28,
        beta: 8 / 3
    }

    render() {
        const { sigma, rho, beta } = this.state

        return <div className='d-flex flex-row' style={{ width: '100vw', height: '100vh' }}>
            <div className='d-flex flex-column px-5 py-3 w-100'>
                <div className='d-flex flex-row'>
                    <div className='d-flex flex-column w-100'>
                        <h1>Lorenz Attractor</h1>
                    </div>
                </div>
                <div className='d-flex flex-row'>
                    <div className='d-flex flex-column p-2'>
                        <label>Sigma (σ)</label>
                        <input type='number' defaultValue={sigma.toString()}
                            onBlur={e => this.setState({ sigma: e.target.valueAsNumber })}
                        />
                    </div>
                    <div className='d-flex flex-column p-2'>
                        <label>Rho (ρ)</label>
                        <input type='number' defaultValue={rho.toString()}
                            onBlur={e => this.setState({ rho: e.target.valueAsNumber })}
                        />
                    </div>
                    <div className='d-flex flex-column p-2'>
                        <label>Beta (β)</label>
                        <input type='number' defaultValue={beta.toString()}
                            onBlur={e => this.setState({ beta: e.target.valueAsNumber })}
                        />
                    </div>
                </div>
                <div className='d-flex flex-row' style={{ flex: 1 }}>
                    <div className='d-flex flex-column w-100'>
                        <View {...this.state} />
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount() {
        this.componentDidUpdate()
    }

    componentDidUpdate() {
        console.log(this.state)
    }
}

class View extends React.Component<{ sigma: number, rho: number, beta: number }, {}> {

    canvas: HTMLCanvasElement
    manager: Manager

    render() {
        return <canvas style={{ width: '100%', height: '100%' }}
            ref={r => this.canvas = r}
        />
    }

    componentDidMount() {
        const { sigma, rho, beta } = this.props
        this.manager = new Manager({ canvas: this.canvas })

        this.manager.start([new Camera(), new LorenzAttractor(sigma, rho, beta)])
    }
}

const center = new Three.Vector3(0, 0, 0)

class Camera extends Actor {

    start() {
        this.camera.position.set(0, 3, 50)

        document.onmousewheel = e => {
            let wheelDelta = e.wheelDeltaY
            let p = this.camera.position
            this.camera.position.set(
                p.x * Math.cos(wheelDelta) - p.z * Math.sin(wheelDelta),
                p.y,
                p.z * Math.cos(wheelDelta) + p.x * Math.sin(wheelDelta)
            )
            this.camera.lookAt(center)
        }
    }

    update(delta) {
        delta = delta * 0.2
        let p = this.camera.position
        this.camera.position.set(
            p.x * Math.cos(delta) - p.z * Math.sin(delta),
            p.y,
            p.z * Math.cos(delta) + p.x * Math.sin(delta)
        )
        this.camera.lookAt(center)
    }
}

class LorenzAttractor extends Actor {
    attractor: any
    line: Three.Line
    index = 0

    constructor(private sigma: number, private rho: number, private beta: number) {
        super()
    }

    *attractorGenerator(point: Three.Vector3, sigma: number, rho: number, beta: number, delta: number): IterableIterator<Three.Vector3> {
        yield point
        while (true) {
            yield point.add(
                new Three.Vector3(
                    sigma * (point.y - point.x), point.x * (rho - point.z) - point.y, point.x * point.y - beta * point.z
                ).multiplyScalar(delta)
            )
        }
    }

    start() {
        this.attractor = this.attractorGenerator(new Three.Vector3(0.01, 0, 0), this.sigma, this.rho, this.beta, 0.005)
        this.index = 0

        let geometry = new Three.BufferGeometry()
        geometry.addAttribute('position', new Three.BufferAttribute(new Float32Array(150000), 3))
        geometry.setDrawRange(0, this.index)
        this.line = new Three.Line(geometry, new Three.LineBasicMaterial({ color: 0x000000 }))

        this.scene.add(this.line)
    }

    update() {
        let point = this.attractor.next().value as Three.Vector3
        let geometry = this.line.geometry as BufferGeometry
        let positionsAttribute = geometry.attributes['position'] as BufferAttribute
        let positionsArray = positionsAttribute.array as Float32Array

        positionsArray[this.index * 3] = point.x
        positionsArray[this.index * 3 + 1] = point.y
        positionsArray[this.index * 3 + 2] = point.z

        this.index++
        geometry.setDrawRange(0, this.index)
        positionsAttribute.needsUpdate = true

        center.multiplyScalar((this.index - 1) / this.index).add(point.clone().multiplyScalar(1 / this.index))
    }
}