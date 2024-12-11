/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from '@enact/sandstone/Button';
import styles from "./Main.module.less";
import CONFIG from "../config";
import axios from "axios";
import { fabric } from 'fabric';

const Home = () => {
	// Load the stickers from the server
	const authToken = window.localStorage.getItem('authToken');
	const [shownStickers, setShownStickers] = useState([]);

	const loadDrawing = useCallback(() => {
		const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/`;

		axios.get(url, {
			headers: {
				'Authorization': `Token ${authToken}`,
			},
		})
			.then((resp) => {
				const allStickers = resp.data;
				const shown = allStickers.filter((sticker) => sticker.shows === true);

				setShownStickers(shown);
			})
			.catch((error) => {
				console.error('Error loading drawing:', error.message);
			});
	}, [authToken]);

	React.useEffect(() => {
		loadDrawing();
	}, [loadDrawing]);

	// Fullscreen-related logic
	const containerRef = useRef(null);
	const [isFullScreen, setIsFullScreen] = useState(false);

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

	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			setIsFullScreen(false);
			exitFullscreen();
		} else {
			setIsFullScreen(true);
			enterFullscreen();
		}
	};

	// Actual aquarium (Fabric.js canvas)
	const aquariumRef = useRef(null);
	const fishArrayRef = useRef([]);

	useEffect(() => {
		// Initialize the Fabric.js canvas
		const canvas = new fabric.Canvas(aquariumRef.current);

		const setCanvasSize = () => {
			const width = isFullScreen ? window.innerWidth : window.innerWidth * 0.8;
			const height = isFullScreen ? window.innerHeight : window.innerHeight * 0.87;

			aquariumRef.current.width = width;
			aquariumRef.current.height = height;
			canvas.setWidth(width);
			canvas.setHeight(height);
			canvas.renderAll();
		};

		setCanvasSize();

		// Create the background gradient
		const waterColor = new fabric.Gradient({
			type: 'linear',
			coords: { x1: 0, y1: 0, x2: 0, y2: canvas.height },
			colorStops: [
				{ offset: 0, color: 'white' },
				{ offset: 0.5, color: '#BBEBFF' },
				{ offset: 1, color: '#76D6FF' },
			],
		});

		canvas.setBackgroundColor(waterColor, canvas.renderAll.bind(canvas));

		// Function to create and animate a fish using SVG
		const createFish = (svgData) => {
			const isLeft = Math.random() > 0.5; // 50% chance to start from left or right

			fabric.loadSVGFromString(svgData, (objects, options) => {
				const fish = fabric.util.groupSVGElements(objects, options);
				fish.set({
					left: isLeft ? -50 : canvas.width + 50, // Position outside canvas initially
					top: Math.random() * canvas.height, // Random vertical position
					originX: 'center',
					originY: 'center',
					selectable: false,
				});

				fish.scale(0.2);

				// Add the fish to canvas
				canvas.add(fish);
				fishArrayRef.current.push(fish); // Store reference for the fish
				canvas.renderAll();
			});
		};

		// Function to animate the fish
		const animateFish = () => {
			fishArrayRef.current.forEach((fish) => {
				const flip = Math.random() > 0.5;
				const newX = Math.random() * (canvas.width / 8) + fish.left;
				const newY = Math.random() * (canvas.height / 5) + fish.top;

				fish.animate({ left: newX, top: newY }, {
					duration: Math.random() * (4000 - 1000) + 1000, // Animation duration
					onChange: canvas.renderAll.bind(canvas),
					easing: fabric.util.ease.easeOutSine, // Smooth easing
					onComplete: () => animateFish(), // Repeat the animation once complete
				});
			});
		};

		// Once stickers are loaded, create the fish using SVG data
		let len = shownStickers.length
		if (len > 0) {
			for (let i = 0; i < len; i++) {
				const svgData = shownStickers[i].sticker.svg; // Select a random sticker's SVG data
				// createFish(svgData);
			}

			// Start animating the fish
			// animateFish();
		}

	}, [isFullScreen, shownStickers]); // Re-run when stickers or fullscreen state change

	return (
		<>
			<div ref={containerRef}>
				<canvas ref={aquariumRef} />
				<Button
					className={styles.fsButton}
					backgroundOpacity="transparent"
					size="small"
					icon="fullscreen"
					onClick={toggleFullscreen}
				/>
			</div>
		</>
	);
};


export default Home;