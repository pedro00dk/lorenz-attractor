import * as React from 'react'
import * as Three from 'three'

import { attractorGenerator } from './lorenz'

export class App extends React.Component<{}, { sigma: number, rho: number, beta: number }> {

    state = {
        sigma: 10,
        rho: 28,
        beta: 8 / 3
    }

    render() {
        let { sigma, rho, beta } = this.state

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

    renderer: Three.Renderer
    scene: Three.Scene
    camera: Three.Camera

    attractor: any
    points: Three.Vector3[]

    render() {
        return <canvas style={{ width: '100%', height: '100%' }}
            ref={r => this.canvas = r}
        />
    }

    componentDidMount() {
        this.renderer = new Three.WebGLRenderer({ canvas: this.canvas })
        this.scene = new Three.Scene()
        this.camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000)

        // resize event

        // animation loop
        let updateLoop = () => {
            requestAnimationFrame(updateLoop)
            this.update()
            this.renderer.render(this.scene, this.camera)
        }

        // initialization
        this.start()
        updateLoop()
    }

    componentDidUpdate() {
        this.start()
    }

    start() {
        let { sigma, rho, beta } = this.props

        this.attractor = attractorGenerator(new Three.Vector3(0.01, 0, 0), sigma, rho, beta, 0.01)
        this.points = []
    }

    update() {
        let { attractor, points } = this

        points.push(attractor.next().value as Three.Vector3)
    }
}