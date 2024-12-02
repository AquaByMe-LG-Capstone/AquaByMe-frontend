import React, { useRef, useState } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import Button from '@enact/sandstone/Button';
import styles from "./Main.module.less";

const shaders = Shaders.create({
	aquarium: {
		frag: GLSL`
		precision highp float;
		varying vec2 uv;
		// uniform float u_daytime;
		uniform float u_time;

		// Color of bottom water
		const vec3 bottomCol = vec3(0.0588, 0.3098, 0.5647);

		// Colors for different times of the day
		const vec3 morningCol = vec3(0.8078, 0.8863, 1.0);  // Soft blue (morning)
		const vec3 noonCol = vec3(0.6157, 0.8078, 1.0);     // Bright blue (noon)
		const vec3 eveningCol = vec3(1.0, 0.6745, 0.5137);  // Orange-pink (evening)
		const vec3 nightCol = vec3(0.0863, 0.0863, 0.2667);    // Dark blue (night)

		// number of waves
		const int waveCnt = 4;

		// Returns sky color based on time
		vec3 getSkyCol() {
			float dayTime = mod(u_time / 60.0, 1.0);
			// Smooth blend for each phase of the day
			float morningToNoon = smoothstep(0.0, 0.25, dayTime) * (1.0 - smoothstep(0.25, 0.5, dayTime));
			float noonToEvening = smoothstep(0.25, 0.5, dayTime) * (1.0 - smoothstep(0.5, 0.75, dayTime));
			float eveningToNight = smoothstep(0.5, 0.75, dayTime) * (1.0 - smoothstep(0.75, 1.0, dayTime));
			float nightToMorning = smoothstep(0.75, 1.0, dayTime) * (1.0 - smoothstep(0.0, 0.25, dayTime));

			// Combine weights and interpolate colors
			vec3 dayColor = morningCol * morningToNoon +
				noonCol * noonToEvening +
				eveningCol * eveningToNight +
				nightCol * nightToMorning;

			return dayColor;
		}
		
		float waveComponent(vec2 uv, vec3 look) {
			float waveFreq = 5.0;
			vec2 p = uv * waveFreq;
			float t = u_time * 3.0; // Time variable for wave animation

			// Wave contributions
			float bump = sin(p.x * 2.0 + t + sin(p.y * 0.73 + t));
			bump += sin(p.x * 1.43 + t) * 0.5;

			float u = dot(look, vec3(0., 1., 0.));
			bump *= u * smoothstep(9., 1., u);
			bump *= smoothstep(0.5, 1., u) * 0.5;

			return bump;
		}

		// Returns water color based on depth
		vec3 waterCol() {
			float depth = uv.y;
			vec3 color = mix(bottomCol, getSkyCol(), smoothstep(0.3 * depth, 1., depth));

			// calculate and add waves at the top
			vec2 uv2 = uv * 2.0 - 1.0;
			uv2.y *= uv.y / uv.x; // Correct for aspect ratio

			// Compute wave height at the current position
			vec3 lookVec = vec3(0., 0.634, 0.);
			float waveHeight = 0.;

			for(int i = 0; i < waveCnt; i++) {
				float offsetFactor = float(i);
				float wave = waveComponent(uv2 + vec2(0.1 * offsetFactor, 1. / (offsetFactor + 2.)), lookVec) - 0.16 * offsetFactor;
				waveHeight += smoothstep(0.016, 0., abs(wave - uv2.y + 1.2 + 0.2 * offsetFactor));
			}

			// color += 0.3 * waveHeight * vec3(0.1, 0.2, 0.4);
			return color;
		}

		void main() {
			gl_FragColor = vec4(waterCol(), 1.0);
		}`
	}
});

// function getPortionedTime() {
// 	const today = new Date();
// 	let hour = today.getHours() / 23;
// 	return hour;
// }

class Aquarium extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			u_time: 0,
		};
		this.startT = null;
		this.loop = this.loop.bind(this);
	}

	componentDidMount() {
		this.startT = performance.now();
		requestAnimationFrame(this.loop); // eslint-disable-line no-undef
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.rafId); // eslint-disable-line no-undef
	}

	loop(t) {
		const elapsedTime = (t - this.startT) / 1000; // Elapsed time in seconds
		this.setState({ u_time: elapsedTime });
		this.rafId = requestAnimationFrame(this.loop); // eslint-disable-line no-undef
	}

	render() {
		const { u_time } = this.state;
		// const { u_time_of_day } = getPortionedTime();
		return <Node shader={shaders.aquarium} uniforms={{ u_time }} />;
	}
}

const Home = () => {
	const containerRef = useRef(null);
	const [isFullScreen, setIsFullScreen] = useState(false);

	// 전체화면으로 전환하는 함수
	const enterFullscreen = () => {
		if (containerRef.current) {
			if (containerRef.current.requestFullscreen) {
				containerRef.current.requestFullscreen();
			} else if (containerRef.current.webkitRequestFullscreen) {
				containerRef.current.webkitRequestFullscreen();
			} else if (containerRef.current.mozRequestFullScreen) {
				containerRef.current.mozRequestFullScreen();
			} else if (containerRef.current.msRequestFullscreen) {
				containerRef.current.msRequestFullscreen();
			}
		}
	};

	// 전체화면을 종료하는 함수
	const exitFullscreen = () => {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	};

	// 전체 화면 토글 & isFullScreen state 업데이트
	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			setIsFullScreen(false);
			exitFullscreen();
		} else {
			setIsFullScreen(true);
			enterFullscreen();
		}
	};

	return (
		<>
			<div ref={containerRef}>
				<Surface width={isFullScreen ? '100vw' : '80vw'} height={isFullScreen ? '100vh' : '87vh'}>
					<Aquarium />
				</Surface>
				<Button
					className={styles.fsButton}
					backgroundOpacity="transparent"
					size="small"
					icon="fullscreen"
					onClick={toggleFullscreen}
				>
				</Button>
			</div>
		</>
	);
};

export default Home;
