import { Spring } from 'svelte/motion';

// Class to wrap state and trigger reactive updates in Svelte 5
class ShaderState {
	// distorts background wave frequency and amplitude
	distort = new Spring(0, {
		stiffness: 0.08,
		damping: 0.28
	});

	// controls the color interpolation ratios (e.g. pink vs yellow-orange dominance)
	colorShift = $state(0);

	// real-time shader wave frequency control (slider adjustable)
	frequencyMultiplier = $state(1.0);
}

export const shaderState = new ShaderState();
