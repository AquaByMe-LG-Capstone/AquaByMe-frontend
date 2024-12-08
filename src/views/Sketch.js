import { useCallback, useState, useEffect, useRef } from 'react';
import Button from '@enact/sandstone/Button';
import { fabric } from 'fabric';
import { CirclePicker } from 'react-color';


const Sketch = () => {
	const [canvas, setCanvas] = useState(null);
	const [bgColor] = useState("#FEFFFF");

	// 그리기/선택 모드 구분
	const [activeTool, setActiveTool] = useState("draw");

	// 브러쉬 초기 설정
	const [lineWidth, setLineWidth] = useState(1);
	const [brushColor, setBrushColor] = useState("#00000");

	// 팔레트 토클
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

	useEffect(() => {
		const initCanvas =
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor,
				isDrawingMode: true,
			});

		initCanvas.freeDrawingBrush.color = brushColor;
		initCanvas.freeDrawingBrush.width = lineWidth;
		setCanvas(initCanvas);

		return () => {
			initCanvas.dispose();
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (canvas) {
			if (activeTool === "draw") {
				canvas.isDrawingMode = true;
				canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
				canvas.freeDrawingBrush.color = brushColor;
				canvas.freeDrawingBrush.width = lineWidth;
				canvas.contextTop.globalCompositeOperation = "source-over";
			} else if (activeTool === "erase") {
				canvas.isDrawingMode = true;
				canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
				canvas.freeDrawingBrush.color = "#FEFFFF";
				canvas.freeDrawingBrush.width = lineWidth;
				canvas.contextTop.globalCompositeOperation = "source-over";
			} else {
				canvas.isDrawingMode = false;
				canvas.selection = activeTool === "select";
				canvas.forEachObject((obj) => (obj.selectable = activeTool === "select"));
			}
			canvas.renderAll();
		}
	}, [activeTool, canvas, brushColor, lineWidth]);

	//MARK: - 두께 설정
	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = lineWidth;
		}
	}, [lineWidth, canvas]);

	const clearCanvas = useCallback(() => {
		if (canvas) {
			canvas.clear();
			canvas.setBackgroundColor("#FFFFFF", canvas.renderAll.bind(canvas));
		}
	}, [canvas]);

	//MARK: - 색상 설정
	const changeBrushColor = useCallback(
		(color) => {
			const selectedColor = color.hex;
			setBrushColor(selectedColor);
			if (canvas) {
				canvas.freeDrawingBrush.color = selectedColor;
				canvas.isDrawingMode = true;
				setActiveTool("draw");
			}
		},
		[canvas]);

	const toggleColorPicker = useCallback(() => {
		setIsColorPickerVisible((prev) => !prev);
	}, []);

	//MARK: - 객체 삭제
	const deleteSelectedObjects = useCallback(() => {
		if (canvas) {
			const activeObjects = canvas.getActiveObjects();
			activeObjects.forEach((object) => {
				canvas.remove(object);
			});
			canvas.discardActiveObject();
			canvas.renderAll();
		}
	}, [canvas]);

	//MARK: - 업로드
	const uploadDrawing = useCallback(() => {
		if (canvas) {
			
		}
	}, [canvas]);

	//MARK: - 레이아웃
	const buttons = [
		{ icon: "trash", onClick: clearCanvas },
		{ icon: "edit", onClick: () => setActiveTool("draw") },
		{ icon: "eraser", onClick: () => setActiveTool("erase") },
		{ icon: "movecursor", onClick: () => setActiveTool("select") },
		{ icon: "closex", onClick: deleteSelectedObjects },
		{ icon: "colorpicker", onClick: toggleColorPicker },
		{ icon: "folderupper", onClick: uploadDrawing },
	];

	const styles = {
		colorPicker: {
			position: "fixed",
			top: "60px",
			left: "1400px",
			backgroundColor: "white",
			zIndex: 10,
			display: isColorPickerVisible ? "block" : "none",
			padding: "10px",
			border: "1px solid #ccc",
			borderRadius: "8px",
		},
		sliderContainer: {
			margin: "10px 0",
			display: "flex",
			alignItems: "center",
		},
		sliderLabel: {
			marginRight: "10px",
			fontWeight: "bold",
		},
		slider: {
			width: "500px",
		},
	};

	return (
		<div>
			{buttons.map(({ icon, onClick }, index) => (
				<Button
					key={index}
					icon={icon}
					iconOnly
					backgroundOpacity="opaque"
					onClick={onClick}
				/>
			))}

			<div style={styles.colorPicker}>
				<CirclePicker color={brushColor} onChangeComplete={changeBrushColor} />
			</div>

			<div style={styles.sliderContainer}>
				<label style={styles.sliderLabel}>두께바꾸기 시작</label>
				<input
					type="range"
					min="1"
					max="50"
					step="5"
					value={lineWidth}
					// eslint-disable-next-line
					onChange={(e) => setLineWidth(Number(e.target.value))}
					style={styles.slider}
				/>
				<span>끝</span>
			</div>

			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;