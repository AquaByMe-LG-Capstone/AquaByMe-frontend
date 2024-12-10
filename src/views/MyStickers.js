import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import useAuth from '../hooks/useAuth';
import CONFIG from '../config';
import axios from 'axios';
import titleImage from "../assets/myart.png";

const MyStickers = () => {
    const authToken = window.localStorage.getItem('authToken');

    const [stickers, setStickers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const loadDrawing = useCallback(() => {
        const authToken = window.localStorage.getItem('authToken');
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/`;

        axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
            },
        })
            .then((resp) => {
                console.log('Post drawing SVG successful:', resp.data, "🧑🏻‍💻");
                setStickers(resp.data);
            })
            .catch((error) => {
                console.error('Error loading drawing:', error.message, "😍");
            });

    }, []);

    React.useEffect(() => {
        console.log("Loading stickers...");
        loadDrawing();
    }, [loadDrawing]);

    React.useEffect(() => {
        console.log("Updated stickers:", stickers);
    }, [stickers]);

    const showToggle = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const currentShows = stickers[indexPath].shows
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/${currentId}`;

        const data = { shows: !currentShows }
        axios.put(url, data, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                console.log(`Sticker ${currentId} updated successfully:`);
                //MARK: - 수정하는 로직 연결
            })
            .catch(() => {
                console.error(`Error updating sticker ${currentId}:`);
            });
    }

    const removeSticker = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/${currentId}`;

        axios.delete(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => {
                console.log(`Sticker ${currentId} sent successfully:`, resp.data);
                const updatedStickers = stickers.filter((_, index) => index !== indexPath);
                setStickers(updatedStickers);
            })
            .catch((error) => {
                console.error(`Error sending sticker ${currentId}:`, error.message);
            });
    }

    const itemRenderer = ({ index, ...rest }) => {
        const sticker = stickers[index];

        if (!sticker) {
            console.log("마이스티커가 없어요!\n")
            return null;
        }

        // fields = ['id', 'svg', 'creator', 'created'] 

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.svg)}`;

        return (
            <div
                {...rest}
                onClick={() => setSelectedIndex(index)}
                style={{
                    position: "relative",
                    backgroundColor: "#f0f0f0",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    fontSize: "16px",
                    border: selectedIndex === index ? "7px solid #4caf50" : "1px solid #ccc",
                    cursor: "pointer",
                }}
            >
                <img
                    src={svgDataUrl}
                    alt={"Sticker"}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                />
            </div>
        );
    };

    return (
        <>
            {/* 상단 타이틀 이미지 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    padding: "20px 0",
                }}
            >
                <img src={titleImage} alt="Title" style={{ maxWidth: "1500px" }} />
            </div>
    
            {/* 버튼과 그리드 리스트 컨테이너 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    backgroundColor: "#FFFFFF",
                    marginTop: "50px",
                }}
            >
                {/* 상단 버튼 컨테이너 */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center", // 버튼 중앙 정렬
                        alignItems: "center",
                        marginBottom: "50px", // 버튼과 그리드 사이 간격
                    }}
                >
                    {/* 개별 버튼 */}
                    <Button
                        icon="trash"
                        iconOnly
                        onClick={removeSticker}
                        style={{
                            padding: "10px",
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                            backgroundColor: "#FFE893",
                            color: "#FBB4A5",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "5px",
                            overflow: "hidden",
                        }}
                    />
    
                    <Button
                        icon="folderupper"
                        iconOnly
                        onClick={showToggle}
                        style={{
                            padding: "10px",
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                            backgroundColor: "#FFE893",
                            color: "#FBB4A5",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "5px",
                            overflow: "hidden",
                        }}
                    />
                </div>
    
                {/* 스티커 리스트 */}
                {stickers.length > 0 ? (
                    <VirtualGridList
                        dataSize={stickers.length}
                        direction="vertical"
                        itemRenderer={itemRenderer}
                        itemSize={{
                            minHeight: 250,
                            minWidth: 280,
                        }}
                        scrollMode="native"
                        spacing={10}
                        style={{
                            width: "80%",
                        }}
                    />
                ) : (
                    <BodyText size="small" style={{ textAlign: "center" }}>
                        스티커를 그려보세요!
                    </BodyText>
                )}
            </div>
        </>
    );
};

export default MyStickers;