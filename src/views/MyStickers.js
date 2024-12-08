import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import useAuth from '../hooks/useAuth';
import CONFIG from '../config';
import axios from 'axios';

const MyStickers = () => {
    const [stickers, setStickers] = useState([]);

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

    const itemRenderer = ({ index, ...rest }) => {
        const sticker = stickers[index];

        if (!sticker) {
            console.log("마이스티커가 없어요!\n")
            return null;
        }

        // fields = ['id', 'svg', 'creator', 'created'] 

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.svg)}`;

        // const buttons = [
        //     { icon: "trash", onClick: clearCanvas },
        // ];

        return (
            <div
                {...rest}
                style={{
                    backgroundColor: "#f0f0f0",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    fontSize: "16px",
                    border: "1px solid #ccc",
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
            <BodyText size="large">
                내가 그린 스티커그림
            </BodyText>

            {stickers.length > 0 ? (
                <VirtualGridList
                    dataSize={stickers.length}
                    direction="vertical"
                    horizontalScrollbar="auto"
                    itemRenderer={itemRenderer}
                    itemSize={{
                        minHeight: 190,
                        minWidth: 230,
                    }}
                    scrollMode="native"
                    spacing={10}
                    verticalScrollbar="auto"
                />
            ) : (
                <BodyText size="small">
                    스티커를 그려보세요!
                </BodyText>
            )}
        </>
    );
};

export default MyStickers;