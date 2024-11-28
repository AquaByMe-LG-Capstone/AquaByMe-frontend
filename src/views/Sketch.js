import { useCallback, useState, useEffect, useRef } from 'react';
import Button from '@enact/sandstone/Button';
import { fabric } from 'fabric';
import { CirclePicker } from 'react-color';

const Sketch = () => {
	const [canvas, setCanvas] = useState(null);
	const bgColor = useRef('#FFFFFF');

	// 그리기/선택 모드 구분
	const [activeTool, setActiveTool] = useState("draw");

	// 브러쉬 초기 설정
	const [lineWidth] = useState(2);
	const [brushColor, setBrushColor] = useState("#000000");

	// 팔레트 토클
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

	useEffect(() => {
		const initCanvas =
			new fabric.Canvas('canvas', {
				height: 780,
				width: 1700,
				backgroundColor: bgColor.current,
				isDrawingMode: true,
			});

		initCanvas.freeDrawingBrush.color = brushColor;
		initCanvas.freeDrawingBrush.width = lineWidth;
		setCanvas(initCanvas);

		return () => {
			initCanvas.dispose();
		};
	}, []);

	useEffect(() => {
		if (canvas) {
			canvas.isDrawingMode = activeTool === "draw";
			canvas.selection = activeTool === "select";
			canvas.forEachObject((obj) => (obj.selectable = activeTool === "select"));
			canvas.renderAll();
		}
	}, [activeTool, canvas]);

	const clearCanvas = useCallback(() => {
		if (canvas) {
			canvas.clear();
			canvas.backgroundColor = bgColor.current;
		}
	}, [canvas]);

	//MARK: - 두께 설정
	const changeLineWidth = useCallback(
		(width) => {
			if (canvas) {
				canvas.freeDrawingBrush.width = width;
			}
		},
		[canvas]);

	//MARK: - 색상 설정
	const changeBrushColor = useCallback(
		(color) => {
			const selectedColor = color.hex;
			setBrushColor(selectedColor);
			if (canvas) {
				canvas.freeDrawingBrush.color = selectedColor;
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

	//MARK: - 레이아웃
	const buttons = [
		{ icon: "trash", onClick: clearCanvas },
		{ icon: "pencil", onClick: () => setActiveTool("draw") },
		{ icon: "select", onClick: () => setActiveTool("select") },
		{ icon: "light", onClick: () => changeLineWidth(2) },
		{ icon: "medium", onClick: () => changeLineWidth(6) },
		{ icon: "bold", onClick: () => changeLineWidth(10) },
		{ icon: "delect", onClick: deleteSelectedObjects },
		{ icon: "palette", onClick: toggleColorPicker }, 
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

			<canvas id="canvas" />
		</div>
	);
};

export default Sketch;