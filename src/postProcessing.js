import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { Vector2 } from 'three'

export function addPostProcessing(renderer, scene, camera) {
    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(window.innerWidth, window.innerHeight)
    
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const pixelatedPass = new RenderPixelatedPass(2, scene, camera)
    composer.addPass(pixelatedPass)

    const afterPass = new AfterimagePass()
    afterPass.uniforms['damp'].value = 0.95
    composer.addPass(afterPass)

    const glitchPass = new GlitchPass()
    glitchPass.enabled = false
    composer.addPass(glitchPass)

    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.enabled = false
    bloomPass.threshold = 0
    bloomPass.strength = 1.5
    bloomPass.radius = 0
    composer.addPass(bloomPass)
    
    return {
        composer: composer, 
        glitch: glitchPass, 
        bloom: bloomPass}
}
