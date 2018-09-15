import * as React from 'react'
import * as Three from 'three'

export class App extends React.Component<{}, { point: Three.Vector3, sigma: number, rho: number, beta: number }> {

    state = {
        point: new Three.Vector3(),
        sigma: 0,
        rho: 0,
        beta: 0
    }

    render() {
        return <div className='d-flex flex-row' style={{ width: '100vw', height: '100vh' }}>
            <div className='d-flex flex-column px-5 py-3 w-100'>
                <div className='d-flex flex-row'>
                    <div className='d-flex flex-column w-100'>
                        <h1>Lorenz Attractor</h1>
                    </div>
                </div>
                <div className='d-flex flex-row' style={{ flex: 1 }}>
                    <div className='d-flex flex-column w-100'>
                        <View />
                    </div>
                </div>
            </div>
        </div>
    }
}

class View extends React.Component<{}, {}> {

    canvas: HTMLCanvasElement

    renderer: Three.Renderer
    scene: Three.Scene
    camera: Three.Camera


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

    start() {
        console.log('start')
    }

    update() {
        console.log('update')
    }
}